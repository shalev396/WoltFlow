import pdf from "pdf-parse";
import dotenv from "dotenv";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {
  type ICustomAPIGatewayProxyEventStepFunction,
  type ICustomStepFunctionResult,
} from "../../types/index.js";
import { Run, Email, Code } from "../../classes/index.js";
import { initDB } from "../../config/bootstrap.js";
import { notifyOnError } from "../../utils/notificationUtil.js";
import { getErrorMessage } from "../../utils/responseUtil.js";

dotenv.config();
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});
await initDB();

export const handler = async (
  event: ICustomAPIGatewayProxyEventStepFunction
): Promise<ICustomStepFunctionResult> => {
  let runId: string | undefined;
  let userId: string | undefined;

  try {
    runId = event.runId || event.queryStringParameters?.runId;

    if (!runId) {
      throw new Error("Missing runId");
    }

    const runData = await Run.findWithUserInbox(runId);

    if (!runData) {
      throw new Error("Run not found");
    }

    userId = runData.userId;

    await Run.updateStage(runId, "getting_code_from_email");

    const targetDate = new Date();

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    console.log(
      `Searching for emails from ${startOfDay.toISOString()} to ${endOfDay.toISOString()} (target date: ${targetDate.toISOString()})`
    );

    if (!runData.hasInbox || !runData.inboxId) {
      console.error(`Inbox not found for user: ${userId}`);
      await Run.markFailed(runId);
      throw new Error("User inbox not found");
    }

    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    let woltEmail: Email | null = null;
    let lastError: string | null = null;
    const maxRetries = 3;
    const retryDelay = 10000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Email search attempt ${attempt}/${maxRetries}`);

        woltEmail = await Email.findWoltGiftEmail(
          runData.inboxId,
          startOfDay,
          endOfDay,
        );

        console.log(
          `Email search returned: ${woltEmail ? "1 email" : "0 emails"}`
        );

        if (woltEmail) {
          console.log(`Email found on attempt ${attempt}`);
          break;
        }

        lastError = `No matching Wolt email found in inbox for date range`;
        console.log(`Attempt ${attempt}: ${lastError}`);

        if (attempt < maxRetries) {
          console.log(
            `Waiting ${retryDelay / 1000} seconds before next attempt...`
          );
          await wait(retryDelay);
        }
      } catch (error) {
        lastError = `Database error: ${getErrorMessage(error)}`;
        console.error(`Attempt ${attempt}: ${lastError}`);

        if (attempt < maxRetries) {
          console.log(
            `Waiting ${retryDelay / 1000} seconds before next attempt...`
          );
          await wait(retryDelay);
        }
      }
    }

    if (!woltEmail) {
      console.error(
        `All ${maxRetries} attempts failed. Final error: ${lastError}`
      );
      await Run.markFailed(runId);
      throw new Error(
        lastError || "No matching Wolt email found after retries"
      );
    }

    let pdfUrl: string | null = null;
    const maxAttachmentRetries = 5;
    const attachmentRetryDelay = 3000;

    for (
      let attachmentAttempt = 1;
      attachmentAttempt <= maxAttachmentRetries;
      attachmentAttempt++
    ) {
      console.log(
        `Attachment search attempt ${attachmentAttempt}/${maxAttachmentRetries}`
      );

      const attachmentUrls = await Email.getAttachmentUrls(woltEmail.id) || [];

      console.log(
        `Found ${attachmentUrls.length} attachments: ${JSON.stringify(
          attachmentUrls
        )}`
      );

      for (const url of attachmentUrls) {
        if (
          url.includes("Wolt_gift_card_English_1.pdf") ||
          url.includes("Wolt gift card English 1.pdf")
        ) {
          pdfUrl = url;
          break;
        }
      }

      if (pdfUrl) {
        console.log(
          `PDF found on attachment attempt ${attachmentAttempt}: ${pdfUrl}`
        );
        break;
      }

      if (attachmentAttempt < maxAttachmentRetries) {
        console.log(
          `No PDF found, waiting ${
            attachmentRetryDelay / 1000
          } seconds for attachment processing...`
        );
        await wait(attachmentRetryDelay);
      }
    }

    if (!pdfUrl) {
      console.error(
        `PDF attachment not found after ${maxAttachmentRetries} attempts`
      );
      await Run.markFailed(runId);
      throw new Error(
        "PDF attachment not found after attachment processing retries"
      );
    }

    let bucketName: string;
    let s3Key: string;

    if (pdfUrl.startsWith("s3://")) {
      const s3UrlMatch = pdfUrl.match(/^s3:\/\/([^/]+)\/(.+)$/);
      if (!s3UrlMatch || !s3UrlMatch[1] || !s3UrlMatch[2]) {
        await Run.markFailed(runId);
        throw new Error("Invalid S3 URL format");
      }
      bucketName = s3UrlMatch[1];
      s3Key = s3UrlMatch[2];
    } else {
      const urlParts = pdfUrl.replace(/^https?:\/\//, "").split("/");
      const domainPart = urlParts.shift();
      if (!domainPart) {
        await Run.markFailed(runId);
        throw new Error("Invalid URL format");
      }
      const bucketPart = domainPart.split(".")[0];
      if (!bucketPart) {
        await Run.markFailed(runId);
        throw new Error("Invalid domain format in URL");
      }
      bucketName = bucketPart;
      s3Key = urlParts.join("/");
    }

    console.log(
      `Downloading PDF from S3 - Bucket: ${bucketName}, Key: ${s3Key}`
    );

    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
    });

    const s3Response = await s3Client.send(getObjectCommand);

    if (!s3Response.Body) {
      await Run.markFailed(runId);
      throw new Error("PDF download failed");
    }

    const reader = s3Response.Body.transformToByteArray();
    const buffer = Buffer.from(await reader);

    const pdfData = await pdf(buffer);
    const match = pdfData.text.match(/CODE:\s*([A-Z0-9]+)/);
    if (!match) {
      await Run.markFailed(runId);
      throw new Error("Code not found in PDF");
    }
    const codeValue = match[1];

    await Code.createFromEmail(userId, runId, woltEmail.id, codeValue!);

    console.log(
      "Gift card code extracted successfully, Step Functions will handle next step"
    );

    return {
      runId,
      userId,
      codeValue,
      success: true,
      message: "Gift card code extracted successfully",
    } as ICustomStepFunctionResult;
  } catch (err) {
    console.error("getDailyCode error:", err);
    if (runId) {
      await Run.markFailed(runId);

      try {
        if (userId) {
          await notifyOnError(userId, runId, "Email processing failed");
        }
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }
    }

    throw new Error("Email processing failed");
  }
};
