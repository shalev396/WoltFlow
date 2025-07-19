import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sequelize from "../../config/database.js";
import User from "../../models/User.js";
import Setting from "../../models/Setting.js";
// import { google } from "googleapis";
import { oauth2_v2 } from "@googleapis/oauth2";

// Connect to database
await sequelize.authenticate();

dotenv.config();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Incoming event:", JSON.stringify(event));
  const isDev = process.env["ENV"] === "Development";
  const oauthRedirectUri = isDev
    ? process.env["OAUTH_REDIRECT_URI_DEV"]!
    : process.env["OAUTH_REDIRECT_URI"]!;

  // 2. Extract 'code', 'state', and 'scope'
  const code = event.queryStringParameters?.["code"];
  const rawState = event.queryStringParameters?.["state"];
  const scope = event.queryStringParameters?.["scope"] || "";
  if (!code || !rawState) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing code or state",
      }),
    };
  }

  // 3. Parse our JSON-packed verifier out of state
  let codeVerifier: string;
  try {
    codeVerifier = JSON.parse(rawState).codeVerifier;
  } catch {
    return { statusCode: 400, body: "Invalid state format" };
  }

  // 4. Exchange code + PKCE verifier for tokens
  const oauth2Client = new OAuth2Client(
    process.env["GOOGLE_CLIENT_ID"],
    process.env["GOOGLE_CLIENT_SECRET"],
    oauthRedirectUri
  );
  const { tokens } = await oauth2Client.getToken({
    code,
    codeVerifier,
    redirectUri: oauthRedirectUri,
  } as any);
  const { access_token, refresh_token } = tokens;
  if (!refresh_token) {
    return { statusCode: 400, body: "No refresh token returned" };
  }

  // 5. Fetch user info
  oauth2Client.setCredentials({ access_token: access_token! });
  const oauth2 = new oauth2_v2.Oauth2({
    auth: oauth2Client,
    // version: "v2"
  });
  const userInfo = await oauth2.userinfo.get();
  const userId = userInfo.data.id!;
  const name = userInfo.data.name || null;
  const email = userInfo.data.email || null;

  // 6. Upsert user in PostgreSQL with name and email
  // This will create new users or update existing ones with fresh Google data
  await User.upsert({
    userId,
    refreshToken: refresh_token,
    name,
    email,
  });

  // 6.1. Check if user granted Gmail access and update settings
  const hasGmailAccess = scope.includes(
    "https://www.googleapis.com/auth/gmail.readonly"
  );
  console.log(`Gmail access granted: ${hasGmailAccess}`);

  // Find existing settings record and update, or create new one
  const [settings] = await Setting.findOrCreate({
    where: { userId },
    defaults: {
      userId,
      hasGmailAccess,
      isNotification: false,
      automationEnabled: false,
      automationMode: "full-run",
    },
  });

  // Update the hasGmailAccess field for existing records
  if (settings.get("hasGmailAccess") !== hasGmailAccess) {
    await settings.update({ hasGmailAccess });
  }

  // 7. Create 7-day session JWT
  const sessionToken = jwt.sign({ userId }, process.env["JWT_SECRET"]!, {
    expiresIn: "7d",
  });

  // 8. Redirect with HTTP-Only cookie
  return {
    statusCode: 302,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; HttpOnly; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }`,
      Location:
        process.env["ENV"] === "Development"
          ? "http://localhost:5173/dashboard"
          : "https://woltflow.shalev396.com/dashboard",
      "Access-Control-Allow-Origin":
        process.env["ENV"] === "Development"
          ? "http://localhost:5173"
          : "https://woltflow.shalev396.com",
      "Access-Control-Allow-Credentials": "true",
    },
    body: "",
  };
};
