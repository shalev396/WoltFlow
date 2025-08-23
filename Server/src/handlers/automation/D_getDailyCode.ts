import { APIGatewayProxyResult } from "aws-lambda";
import { ICustomAPIGatewayProxyEventStepFunction } from "../../typescript/interfaces/aws.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Op } from "sequelize";

import pdf from "pdf-parse";
import dotenv from "dotenv";
import sequelize from "../../config/database.js";
import { User, Code, Run, Inbox, Emails } from "../../models/index.js";
import { syncDatabase } from "../../config/bootstrap.js";
import { notifyOnError } from "../../utils/notificationUtil.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../utils/responseUtil.js";
// Environment variables
dotenv.config();
const ENV = process.env["ENV"];

// S3 configuration for email attachments
let S3_EMAIL_BUCKET_NAME = "";
if (ENV === "prod") {
  S3_EMAIL_BUCKET_NAME = process.env["S3_EMAIL_BUCKET_NAME_PROD"] || "";
} else if (ENV === "dev") {
  S3_EMAIL_BUCKET_NAME = process.env["S3_EMAIL_BUCKET_NAME_DEV"] || "";
} else if (ENV === "local") {
  S3_EMAIL_BUCKET_NAME = process.env["S3_EMAIL_BUCKET_NAME_LOCAL"] || "";
}

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env["AWS_REGION"] || "il-central-1",
});
// Connect to database
await sequelize.authenticate();
await syncDatabase();

export const handler = async (
  event: ICustomAPIGatewayProxyEventStepFunction
): Promise<APIGatewayProxyResult> => {
  let run: Run | null = null;

  try {
    // Extract runId from event (Step Functions or API Gateway)
    const runId = event.runId || event.queryStringParameters?.["runId"];

    if (!runId) {
      return createErrorResponse("Missing runId", 400);
    }

    // Get the run with associated user and inbox in one optimized query
    run = await Run.findByPk(runId, {
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
    });

    if (!run) {
      return createErrorResponse("Run not found", 404);
    }

    const uid = run.userId;

    // Update run stage
    await run.update({ stage: "getting_code_from_email" });

    let targetDate = new Date();
    if (process.env["ENV"] === "local") {
      if (process.env["DEVELOPMENT_DATE"]) {
        const d = new Date(process.env["DEVELOPMENT_DATE"]);
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

    const user = (run as any).user;
    if (!user) {
      console.error(`User not found for uid: ${uid}`);
      await run.update({ status: "failed" });

      try {
        await notifyOnError(uid.toString(), run.id, "User not found");
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }

      return createErrorResponse("User not found", 404);
    }

    const inbox = user.inbox;
    if (!inbox) {
      console.error(`Inbox not found for user: ${uid}`);
      await run.update({ status: "failed" });

      try {
        await notifyOnError(uid.toString(), run.id, "User inbox not found");
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }

      return createErrorResponse("User inbox not found", 404);
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
      } catch (error: any) {
        lastError = `Database error: ${error.message}`;
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

      try {
        await notifyOnError(uid.toString(), run.id, "No Wolt email found");
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }

      return createErrorResponse(
        lastError || "No matching Wolt email found after retries",
        404
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

      try {
        await notifyOnError(uid.toString(), run.id, "PDF attachment not found");
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }

      return createErrorResponse("PDF attachment not found", 404);
    }

    // Extract S3 key from URL - assuming URL format like https://bucket.s3.region.amazonaws.com/path/file.pdf
    const urlParts = pdfUrl.replace(/^https?:\/\//, "").split("/");
    urlParts.shift(); // Remove bucket domain
    const s3Key = urlParts.join("/");

    console.log(`Downloading PDF from S3: ${s3Key}`);

    // Download PDF from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: S3_EMAIL_BUCKET_NAME,
      Key: s3Key,
    });

    const s3Response = await s3Client.send(getObjectCommand);

    if (!s3Response.Body) {
      await run.update({ status: "failed" });

      try {
        await notifyOnError(uid.toString(), run.id, "PDF download failed");
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }

      return createErrorResponse("PDF download failed", 500);
    }

    // Convert stream to buffer
    const reader = s3Response.Body.transformToByteArray();
    const buffer = Buffer.from(await reader);

    const pdfData = await pdf(buffer);
    const match = pdfData.text.match(/CODE:\s*([A-Z0-9]+)/);
    if (!match) {
      await run.update({ status: "failed" });

      try {
        await notifyOnError(uid.toString(), run.id, "Code not found in PDF");
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }

      return createErrorResponse("Code not found in PDF", 500);
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

    // Check if this is a Step Functions call (has runId directly in event)
    const isStepFunctions = !!event.runId || !!event.Payload?.runId;

    if (isStepFunctions) {
      // Return raw data for Step Functions - at root level for JSONPath
      return {
        runId,
        userId: uid,
        codeValue,
        success: true,
        message: "Gift card code extracted successfully",
      } as any;
    } else {
      // Return API Gateway format for HTTP calls
      return createSuccessResponse("Gift card code extracted successfully", {
        runId,
        userId: uid,
        codeValue,
      });
    }
  } catch (err: any) {
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

    const isStepFunctions = !!event.runId || !!event.Payload?.runId;

    if (isStepFunctions) {
      // Re-throw error for Step Functions to catch
      throw err;
    } else {
      // Return API Gateway error format for HTTP calls
      return createErrorResponse(getErrorMessage(err));
    }
  }
};
