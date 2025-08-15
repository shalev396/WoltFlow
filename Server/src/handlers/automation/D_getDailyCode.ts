import { APIGatewayProxyResult } from "aws-lambda";
import { ICustomAPIGatewayProxyEventStepFunction } from "../../typescript/interfaces/aws.js";
import { gmail_v1 } from "@googleapis/gmail"; // Scoped Gmail client
import { OAuth2Client } from "google-auth-library"; // Standalone auth library

import pdf from "pdf-parse";
import dotenv from "dotenv";
import sequelize from "../../config/database.js";
import { User, Code, Run } from "../../models/index.js";
import { syncDatabase } from "../../config/bootstrap.js";
import { notifyOnError } from "../../utils/notificationUtil.js";
import {
  createSuccessResponse,
  createErrorResponse,
  createSuccessData,
  getErrorMessage,
} from "../../utils/responseUtil.js";
// Environment variables
dotenv.config();
const ENV = process.env["ENV"];
let ENV_OAUTH_REDIRECT_URI = "";
if (ENV === "prod") {
  ENV_OAUTH_REDIRECT_URI = process.env["OAUTH_REDIRECT_URI_PROD"] || "";
} else if (ENV === "dev") {
  ENV_OAUTH_REDIRECT_URI = process.env["OAUTH_REDIRECT_URI_DEV"] || "";
} else if (ENV === "local") {
  ENV_OAUTH_REDIRECT_URI = process.env["OAUTH_REDIRECT_URI_LOCAL"] || "";
}
// Connect to database
await sequelize.authenticate();
await syncDatabase();

export const handler = async (
  event: ICustomAPIGatewayProxyEventStepFunction
): Promise<APIGatewayProxyResult> => {
  let run: Run | null = null;

  try {
    const oauthRedirectUri = ENV_OAUTH_REDIRECT_URI;

    // Extract runId from event (Step Functions or API Gateway)
    const runId = event.runId || event.queryStringParameters?.["runId"];

    if (!runId) {
      return createErrorResponse("Missing runId", 400);
    }

    // Get the run with associated user in one optimized query
    run = await Run.findByPk(runId, {
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    if (!run) {
      // Note: Cannot update run status since run is null
      return createErrorResponse("Run not found", 404);
    }

    const uid = run.userId;

    // Update run stage
    await run.update({ stage: "getting_code_from_email" });

    let targetDate = new Date();
    //TODO: Remove || true
    if (
      process.env["ENV"] === "dev" ||
      process.env["ENV"] === "local"
      // ||true
    ) {
      // First check if date parameter is provided
      // if (event.queryStringParameters?.date) {
      //   const d = new Date(event.queryStringParameters.date);
      //   if (!isNaN(d.getTime())) targetDate = d;
      // }
      // If no date parameter, use development default date from env var
      //else
      if (process.env["DEVELOPMENT_DATE"]) {
        const d = new Date(process.env["DEVELOPMENT_DATE"]);
        if (!isNaN(d.getTime())) targetDate = d;
      }
    }
    //making dates param for gmail search
    const pad = (n: number) => String(n).padStart(2, "0");
    const y = targetDate.getFullYear();
    const m = pad(targetDate.getMonth() + 1);
    const d = pad(targetDate.getDate());
    const after = `${y}/${m}/${d}`;
    const tomorrow = new Date(targetDate);
    tomorrow.setDate(targetDate.getDate() + 1);
    const by = `${tomorrow.getFullYear()}/${pad(tomorrow.getMonth() + 1)}/${pad(
      tomorrow.getDate()
    )}`;

    console.log(
      `Searching for emails from ${after} to ${by} (target date: ${targetDate.toISOString()})`
    );

    const user = (run as any).user;
    if (!user) {
      console.error(`User not found for uid: ${uid}`);
      await run.update({ status: "failed" });

      // Send error notification to user
      try {
        await notifyOnError(uid.toString(), run.id, "User not found");
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }

      return createErrorResponse("User not found", 404);
    }

    const oauth2Client = new OAuth2Client(
      process.env["GOOGLE_CLIENT_ID"]!,
      process.env["GOOGLE_CLIENT_SECRET"]!,
      oauthRedirectUri!
    );

    oauth2Client.setCredentials({ refresh_token: user.googleRefreshToken });
    const gmail = new gmail_v1.Gmail({
      auth: oauth2Client,
      // version: "v1",
    });

    const subject = '"הגיפט קארד של Wolt הגיע ומחכה לשליחה :)"';
    const q = `from:info@wolt.com subject:${subject} after:${after} before:${by}`;
    console.log(`Gmail search query: ${q}`);

    // Helper function to wait for specified milliseconds
    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    let msgs: any[] | undefined;
    let lastError: string | null = null;
    const maxRetries = 3;
    const retryDelay = 10000; // 10 seconds

    // Retry logic for email search
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Email search attempt ${attempt}/${maxRetries}`);

        const listRes = await gmail.users.messages.list({
          userId: "me",
          q,
          maxResults: 1,
        });

        msgs = listRes.data.messages;
        console.log(`Gmail search returned ${msgs?.length || 0} messages`);

        if (msgs && msgs.length > 0) {
          console.log(`Email found on attempt ${attempt}`);
          break; // Success, exit retry loop
        }

        // No messages found
        lastError = `No matching Wolt email found for query: ${q}`;
        console.log(`Attempt ${attempt}: ${lastError}`);

        // If this isn't the last attempt, wait before retrying
        if (attempt < maxRetries) {
          console.log(
            `Waiting ${retryDelay / 1000} seconds before next attempt...`
          );
          await wait(retryDelay);
        }
      } catch (error: any) {
        lastError = `Gmail API error: ${error.message}`;
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

    // If we still don't have messages after all retries, fail
    if (!msgs || msgs.length === 0) {
      console.error(
        `All ${maxRetries} attempts failed. Final error: ${lastError}`
      );
      await run.update({ status: "failed" });

      // Send error notification to user
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

    const msg = await gmail.users.messages.get({
      userId: "me",
      id: msgs[0]!.id!,
      format: "full",
    });

    const parts = msg.data.payload?.parts || [];
    let attachmentId: string | null = null;
    for (const part of parts) {
      if (
        part.filename === "Wolt gift card English 1.pdf" &&
        part.body?.attachmentId
      ) {
        attachmentId = part.body.attachmentId;
        break;
      }
    }
    if (!attachmentId) {
      await run.update({ status: "failed" });

      // Send error notification to user
      try {
        await notifyOnError(uid.toString(), run.id, "PDF attachment not found");
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }

      return createErrorResponse("PDF attachment not found", 404);
    }

    const attach = await gmail.users.messages.attachments.get({
      userId: "me",
      messageId: msgs[0]!.id!,
      id: attachmentId,
    });
    const data = attach.data.data!;
    const buffer = Buffer.from(data, "base64");

    const pdfData = await pdf(buffer);
    const match = pdfData.text.match(/CODE:\s*([A-Z0-9]+)/);
    if (!match) {
      await run.update({ status: "failed" });

      // Send error notification to user
      try {
        await notifyOnError(uid.toString(), run.id, "Code not found in PDF");
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }

      return createErrorResponse("Code not found in PDF", 500);
    }
    const codeValue = match[1];

    // Save into Codes table
    await Code.create({
      userId: uid,
      code: codeValue,
      isUsed: false,
    });

    console.log(
      "Gift card code extracted successfully, Step Functions will handle next step"
    );

    // Step Functions will automatically trigger woltApplyGift next
    // No need to manually invoke here

    // Check if this is a Step Functions call (has runId directly in event)
    const isStepFunctions = !!event.runId || !!event.Payload?.runId;

    if (isStepFunctions) {
      // Return raw data for Step Functions
      return createSuccessData("Gift card code extracted successfully", {
        runId,
        userId: uid,
        codeValue,
      }) as any;
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

      // Send error notification to user
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
