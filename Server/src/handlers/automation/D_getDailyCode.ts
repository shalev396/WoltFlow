import { Op } from "sequelize";
import pdf from "pdf-parse";
import dotenv from "dotenv";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {
  type ICustomAPIGatewayProxyEventStepFunction,
  type RunWithUserWithInbox,
  type ICustomStepFunctionResult,
} from "../../types/index.js";
import { User, Code, Run, Inbox, Emails } from "../../models/index.js";
import { initDB } from "../../config/bootstrap.js";
import { notifyOnError } from "../../utils/notificationUtil.js";
import { getErrorMessage } from "../../utils/responseUtil.js";

// Environment variables
dotenv.config();
// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});
// Connect to database
await initDB();

export const handler = async (
  event: ICustomAPIGatewayProxyEventStepFunction
): Promise<ICustomStepFunctionResult> => {
  let run = null;
  try {
    // Extract runId from event (Step Functions or API Gateway(Debug))
    const runId = event.runId || event.queryStringParameters?.runId;

    if (!runId) {
      throw new Error("Missing runId");
    }

    // Get the run with associated user and inbox in one optimized query
    run = (await Run.findByPk(runId, {
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: Inbox,
              as: "inbox",
            },
          ],
        },
      ],
    })) as RunWithUserWithInbox;

    if (!run) {
      throw new Error("Run not found");
    }

    const uid = run.userId;

    // Update run stage
    await run.update({ stage: "getting_code_from_email" });

    let targetDate = new Date();
    if (process.env.ENV === "local") {
      if (process.env.DEVELOPMENT_DATE) {
        const d = new Date(process.env.DEVELOPMENT_DATE);
        if (!isNaN(d.getTime())) targetDate = d;
      }
    }

    // Calculate date range for email search
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    console.log(
      `Searching for emails from ${startOfDay.toISOString()} to ${endOfDay.toISOString()} (target date: ${targetDate.toISOString()})`
    );

    const user = run.user;
    if (!user) {
      console.error(`User not found for uid: ${uid}`);
      await run.update({ status: "failed" });

      throw new Error("User not found");
    }

    const inbox = user.inbox;
    if (!inbox) {
      console.error(`Inbox not found for user: ${uid}`);
      await run.update({ status: "failed" });

      throw new Error("User inbox not found");
    }

    const subject = "הגיפט קארד של Wolt הגיע ומחכה לשליחה :)";
    console.log(`Searching for email with subject: ${subject}`);

    // Helper function to wait for specified milliseconds
    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    let woltEmail: Emails | null = null;
    let lastError: string | null = null;
    const maxRetries = 3;
    const retryDelay = 10000; // 10 seconds

    // Retry logic for email search
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Email search attempt ${attempt}/${maxRetries}`);

        // Search for Wolt gift card email in user's inbox
        woltEmail = await Emails.findOne({
          where: {
            inboxId: inbox.id,
            fromEmail: "info@wolt.com",
            subject: subject,
            emailDate: {
              [Op.between]: [startOfDay, endOfDay],
            },
            attachmentUrls: {
              [Op.ne]: null, // Must have attachments
            },
          },
          order: [["emailDate", "DESC"]], // Get most recent email
        });

        console.log(
          `Email search returned: ${woltEmail ? "1 email" : "0 emails"}`
        );

        if (woltEmail) {
          console.log(`Email found on attempt ${attempt}`);
          break; // Success, exit retry loop
        }

        // No messages found
        lastError = `No matching Wolt email found in inbox for date range`;
        console.log(`Attempt ${attempt}: ${lastError}`);

        // If this isn't the last attempt, wait before retrying
        if (attempt < maxRetries) {
          console.log(
            `Waiting ${retryDelay / 1000} seconds before next attempt...`
          );
          await wait(retryDelay);
        }
      } catch (error) {
        lastError = `Database error: ${getErrorMessage(error)}`;
        console.error(`Attempt ${attempt}: ${lastError}`);

        // If this isn't the last attempt, wait before retrying
        if (attempt < maxRetries) {
          console.log(
            `Waiting ${retryDelay / 1000} seconds before next attempt...`
          );
          await wait(retryDelay);
        }
      }
    }

    // If we still don't have an email after all retries, fail
    if (!woltEmail) {
      console.error(
        `All ${maxRetries} attempts failed. Final error: ${lastError}`
      );
      await run.update({ status: "failed" });
      throw new Error(
        lastError || "No matching Wolt email found after retries"
      );
    }

    // Find the PDF attachment URL
    const attachmentUrls = woltEmail.attachmentUrls || [];
    let pdfUrl: string | null = null;

    // Look for the specific Wolt gift card PDF
    for (const url of attachmentUrls) {
      if (
        url.includes("Wolt_gift_card_English_1.pdf") ||
        url.includes("Wolt gift card English 1.pdf")
      ) {
        pdfUrl = url;
        break;
      }
    }

    if (!pdfUrl) {
      await run.update({ status: "failed" });
      throw new Error("PDF attachment not found");
    }

    // Parse S3 URL (format: s3://bucket-name/key/path/file.pdf)
    let bucketName: string;
    let s3Key: string;

    if (pdfUrl.startsWith("s3://")) {
      // Parse s3:// URL format
      const s3UrlMatch = pdfUrl.match(/^s3:\/\/([^\/]+)\/(.+)$/);
      if (!s3UrlMatch || !s3UrlMatch[1] || !s3UrlMatch[2]) {
        await run.update({ status: "failed" });
        throw new Error("Invalid S3 URL format");
      }
      bucketName = s3UrlMatch[1];
      s3Key = s3UrlMatch[2]; // No leading slash for S3 keys
    } else {
      // Fallback for HTTPS URLs (legacy format)
      const urlParts = pdfUrl.replace(/^https?:\/\//, "").split("/");
      const domainPart = urlParts.shift();
      if (!domainPart) {
        await run.update({ status: "failed" });
        throw new Error("Invalid URL format");
      }
      const bucketPart = domainPart.split(".")[0];
      if (!bucketPart) {
        await run.update({ status: "failed" });
        throw new Error("Invalid domain format in URL");
      }
      bucketName = bucketPart; // Extract bucket name from domain
      s3Key = urlParts.join("/");
    }

    console.log(
      `Downloading PDF from S3 - Bucket: ${bucketName}, Key: ${s3Key}`
    );

    // Download PDF from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
    });

    const s3Response = await s3Client.send(getObjectCommand);

    if (!s3Response.Body) {
      await run.update({ status: "failed" });
      throw new Error("PDF download failed");
    }

    // Convert stream to buffer
    const reader = s3Response.Body.transformToByteArray();
    const buffer = Buffer.from(await reader);

    const pdfData = await pdf(buffer);
    const match = pdfData.text.match(/CODE:\s*([A-Z0-9]+)/);
    if (!match) {
      await run.update({ status: "failed" });
      throw new Error("Code not found in PDF");
    }
    const codeValue = match[1];

    // Save into Codes table with email reference
    await Code.create({
      userId: uid,
      runId: runId,
      emailId: woltEmail.id, // Link to the source email
      code: codeValue,
      isUsed: false,
    });

    console.log(
      "Gift card code extracted successfully, Step Functions will handle next step"
    );

    // Return raw data for Step Functions - at root level for JSONPath
    return {
      runId,
      userId: uid,
      codeValue,
      success: true,
      message: "Gift card code extracted successfully",
    } as ICustomStepFunctionResult;
  } catch (err) {
    console.error("getDailyCode error:", err);
    if (run) {
      await run.update({ status: "failed" });

      try {
        await notifyOnError(
          run.userId.toString(),
          run.id,
          "Email processing failed"
        );
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }
    }

    throw new Error("Email processing failed");
  }
};
