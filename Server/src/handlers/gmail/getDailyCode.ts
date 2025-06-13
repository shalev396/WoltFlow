import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Lambda } from "aws-sdk";
import { google } from "googleapis";
import pdf from "pdf-parse";
import dotenv from "dotenv";
import sequelize from "../../config/database";
import User from "../../models/User";
import Code from "../../models/Code";

dotenv.config();
const lambda = new Lambda();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    await sequelize.authenticate();
    // ensure Codes table exists (dev only)
    if (process.env.ENV === "Development") {
      await Code.sync({ alter: true });
    }

    const uid = event.queryStringParameters?.uid;
    if (!uid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing uid" }),
      };
    }

    let targetDate = new Date();
    if (
      process.env.ENV === "Development" &&
      event.queryStringParameters?.date
    ) {
      const d = new Date(event.queryStringParameters.date);
      if (!isNaN(d.getTime())) targetDate = d;
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

    const user = await User.findByPk(uid);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.OAUTH_REDIRECT_URI!
    );
    oauth2Client.setCredentials({ refresh_token: user.refreshToken });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const subject = '"הגיפט קארד של Wolt הגיע ומחכה לשליחה :)"';
    const q = `from:info@wolt.com subject:${subject} after:${after} before:${by}`;
    const listRes = await gmail.users.messages.list({
      userId: "me",
      q,
      maxResults: 1,
    });

    const msgs = listRes.data.messages;
    if (!msgs || msgs.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No matching Wolt email found" }),
      };
    }

    const msg = await gmail.users.messages.get({
      userId: "me",
      id: msgs[0].id!,
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
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "PDF attachment not found" }),
      };
    }

    const attach = await gmail.users.messages.attachments.get({
      userId: "me",
      messageId: msgs[0].id!,
      id: attachmentId,
    });
    const data = attach.data.data!;
    const buffer = Buffer.from(data, "base64");

    const pdfData = await pdf(buffer);
    const match = pdfData.text.match(/CODE:\s*([A-Z0-9]+)/);
    if (!match) {
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
    const isOffline = process.env.IS_OFFLINE === "true";

    if (isOffline) {
      // For serverless offline, make HTTP request without waiting
      console.log(
        "Running in offline mode, triggering woltApplyGift (fire-and-forget)"
      );

      // Fire and forget - don't await the response
      fetch(`http://localhost:3000/api/wolt/applyGift?userId=${uid}`, {
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
      const functionName = process.env.WOLT_APPLY_GIFT_FUNCTION_NAME!;
      const invokeParams = {
        FunctionName: functionName,
        InvocationType: "Event" as const, // Fire and forget
        Payload: JSON.stringify({
          queryStringParameters: { userId: uid },
        }),
      };

      // Fire and forget - don't await the response
      lambda
        .invoke(invokeParams)
        .promise()
        .catch((error) => {
          console.error(
            "Lambda invoke to woltApplyGift failed (but continuing):",
            error
          );
        });

      console.log(
        "woltApplyGift Lambda invocation triggered (not waiting for completion)"
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Internal error" }),
    };
  }
};
