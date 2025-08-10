import { APIGatewayProxyResult } from "aws-lambda";
import { ICustomAPIGatewayProxyEventStepFunction } from "../../typescript/interfaces/aws.js";
import { gmail_v1 } from "@googleapis/gmail";
import { OAuth2Client } from "google-auth-library";

import pdf from "pdf-parse";
import dotenv from "dotenv";
import sequelize from "../../config/database.js";
import User from "../../models/User.js";
import Code from "../../models/Code.js";
import { syncDatabase } from "../../config/bootstrap.js";

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
  try {
    const oauthRedirectUri = ENV_OAUTH_REDIRECT_URI;

    // Extract userId from event
    const userId = event.queryStringParameters?.["userId"];

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing userId parameter" }),
      };
    }

    console.log(`Starting to scan all Wolt codes for user: ${userId}`);

    // Calculate date range for last 6 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    // Format dates for Gmail search
    const pad = (n: number) => String(n).padStart(2, "0");
    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = pad(date.getMonth() + 1);
      const d = pad(date.getDate());
      return `${y}/${m}/${d}`;
    };

    const after = formatDate(startDate);
    const before = formatDate(endDate);

    console.log(`Searching for emails from ${after} to ${before}`);

    const user = await User.findByPk(userId);
    if (!user) {
      console.error(`User not found for userId: ${userId}`);
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
    });

    const subject = '"הגיפט קארד של Wolt הגיע ומחכה לשליחה :)"';
    const q = `from:info@wolt.com subject:${subject} after:${after} before:${before}`;
    console.log(`Gmail search query: ${q}`);

    // Get all matching messages
    let allMessages: any[] = [];
    let nextPageToken: string | undefined;

    do {
      const listParams: any = {
        userId: "me",
        q,
        maxResults: 100, // Gmail API max per request
      };

      if (nextPageToken) {
        listParams.pageToken = nextPageToken;
      }

      const listRes = await gmail.users.messages.list(listParams);

      const messages = listRes.data.messages || [];
      allMessages.push(...messages);
      nextPageToken = listRes.data.nextPageToken || undefined;

      console.log(
        `Found ${messages.length} messages in this batch. Total so far: ${allMessages.length}`
      );
    } while (nextPageToken);

    console.log(`Total emails found: ${allMessages.length}`);

    if (allMessages.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "No Wolt emails found in the last 6 months",
          codesProcessed: 0,
          newCodes: 0,
        }),
      };
    }

    let codesProcessed = 0;
    let newCodes = 0;
    const processedCodes: string[] = [];

    // Process each email
    for (const message of allMessages) {
      try {
        console.log(
          `Processing email ${codesProcessed + 1}/${allMessages.length}`
        );

        const msg = await gmail.users.messages.get({
          userId: "me",
          id: message.id!,
          format: "full",
        });

        const parts = msg.data.payload?.parts || [];
        let attachmentId: string | null = null;

        // Find the PDF attachment
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
          console.log(`No PDF attachment found in email ${message.id}`);
          continue;
        }

        // Download and process the PDF
        const attach = await gmail.users.messages.attachments.get({
          userId: "me",
          messageId: message.id!,
          id: attachmentId,
        });

        const data = attach.data.data!;
        const buffer = Buffer.from(data, "base64");

        const pdfData = await pdf(buffer);
        const match = pdfData.text.match(/CODE:\s*([A-Z0-9]+)/);

        if (!match) {
          console.log(`No code found in PDF from email ${message.id}`);
          continue;
        }

        const codeValue = match[1];
        if (codeValue) {
          processedCodes.push(codeValue);
        }

        // Check if code already exists in database
        const existingCode = await Code.findOne({
          where: {
            userId: userId,
            code: codeValue,
          },
        });

        if (existingCode) {
          console.log(`Code ${codeValue} already exists in database`);
        } else {
          // Save new code to database
          await Code.create({
            userId: userId,
            code: codeValue,
            isUsed: false,
          });
          newCodes++;
          console.log(`Saved new code: ${codeValue}`);
        }

        codesProcessed++;

        // Add a small delay to avoid overwhelming the Gmail API
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (emailError: any) {
        console.error(`Error processing email ${message.id}:`, emailError);
        // Continue with next email instead of failing the whole process
      }
    }

    console.log(
      `Finished processing. Total codes: ${codesProcessed}, New codes: ${newCodes}`
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully scanned all Wolt emails",
        emailsFound: allMessages.length,
        codesProcessed,
        newCodes,
        processedCodes,
      }),
    };
  } catch (err: any) {
    console.error("getAllWoltCodes error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: err.message || "Unknown error",
      }),
    };
  }
};
