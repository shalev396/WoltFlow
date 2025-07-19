import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { gmail_v1 } from "@googleapis/gmail"; // Scoped Gmail client
import { OAuth2Client } from "google-auth-library"; // Standalone auth library

import pdf from "pdf-parse";
import dotenv from "dotenv";
import sequelize from "../../config/database.js";
import User from "../../models/User.js";
import Code from "../../models/Code.js";
import Run from "../../models/Run.js";

// Connect to database
await sequelize.authenticate();

dotenv.config();
const lambdaClient = new LambdaClient({
  region: process.env["AWS_REGION"] || "il-central-1", // configure region
});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let run: Run | null = null;

  try {
    const isDev = process.env["ENV"] === "Development";
    const baseURL = isDev
      ? "http://localhost:3000/api"
      : `https://woltflow.shalev396.com/api`;

    const oauthRedirectUri = isDev
      ? process.env["OAUTH_REDIRECT_URI_DEV"]!
      : process.env["OAUTH_REDIRECT_URI"]!;

    await sequelize.authenticate();
    // ensure Codes table exists (dev only)
    if (process.env["ENV"] === "Development") {
      await Code.sync({ alter: true });
    }

    const runId = event.queryStringParameters?.["runId"];
    if (!runId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing runId" }),
      };
    }

    // Get the run and associated user
    run = await Run.findByPk(runId);
    if (!run) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Run not found" }),
      };
    }

    const uid = run.get("user_id");

    // Update run stage
    await run.update({ stage: "getting code from mail" });

    let targetDate = new Date();
    //TODO: Remove || true
    if (process.env["ENV"] === "Development") {
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

    const user = await User.findByPk(uid);
    if (!user) {
      console.error(`User not found for uid: ${uid}`);
      await run.update({ status: "failed" });
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    const oauth2Client = new OAuth2Client(
      process.env["GOOGLE_CLIENT_ID"]!,
      process.env["GOOGLE_CLIENT_SECRET"]!,
      oauthRedirectUri!
    );

    oauth2Client.setCredentials({ refresh_token: user.get("refreshToken") });
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
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: lastError || "No matching Wolt email found after retries",
        }),
      };
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
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "PDF attachment not found" }),
      };
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
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Code not found in PDF" }),
      };
    }
    const codeValue = match[1];

    // Save into Codes table
    await Code.create({
      userId: uid,
      code: codeValue,
      isUsed: false,
    });

    console.log(
      "Gift card code extracted successfully, triggering woltApplyGift function"
    );

    // Fire-and-forget trigger woltApplyGift function

    if (isDev) {
      // For serverless offline, make HTTP request without waiting
      console.log(
        "Running in offline mode, triggering woltApplyGift (fire-and-forget)"
      );

      // Fire and forget - don't await the response
      fetch(`${baseURL}/wolt/applyGift?runId=${runId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        console.error(
          "HTTP request to woltApplyGift failed (but continuing):",
          error
        );
      });

      console.log(
        "woltApplyGift HTTP request triggered (not waiting for completion)"
      );
    } else {
      // For production, use Lambda invoke with fire-and-forget
      const functionName = process.env["WOLT_APPLY_GIFT_FUNCTION_NAME"]!;
      const invokeParams = {
        FunctionName: functionName,
        InvocationType: "Event" as const, // Fire and forget
        Payload: JSON.stringify({
          queryStringParameters: { runId },
        }),
      };

      // Fire and forget - don't await the response
      const command = new InvokeCommand(invokeParams);
      const result = await lambdaClient.send(command);

      console.log(
        `woltApplyGift Lambda invocation triggered (not waiting for completion)Status: ${result?.StatusCode}`
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
      }),
    };
  } catch (err: any) {
    console.error("getDailyCode error:", err);
    if (run) {
      await run.update({ status: "failed" });
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Internal error" }),
    };
  }
};
