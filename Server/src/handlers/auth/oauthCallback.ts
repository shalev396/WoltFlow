import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sequelize from "../../config/database";
import User from "../../models/User";
import { google } from "googleapis";

dotenv.config();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // 1. Ensure DB connection
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  // 2. Extract 'code' + 'state'
  const code = event.queryStringParameters?.code;
  const rawState = event.queryStringParameters?.state;
  if (!code || !rawState) {
    return { statusCode: 400, body: "Missing code or state" };
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
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI
  );
  const { tokens } = await oauth2Client.getToken({
    code,
    codeVerifier, // correct key name :contentReference[oaicite:3]{index=3}
    redirectUri: process.env.OAUTH_REDIRECT_URI,
  } as any);
  const { access_token, refresh_token } = tokens;
  if (!refresh_token) {
    return { statusCode: 400, body: "No refresh token returned" };
  }

  // 5. Fetch user info
  oauth2Client.setCredentials({ access_token });
  const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
  const userInfo = await oauth2.userinfo.get();
  const userId = userInfo.data.id!;

  // 6. Upsert user in PostgreSQL
  await User.upsert({ userId, refreshToken: refresh_token });

  // 7. Create 7-day session JWT
  const sessionToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
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
        process.env.ENV === "Development"
          ? "http://localhost:5173/dashboard"
          : "https://woltflow.shalev396.com/dashboard",
      "Access-Control-Allow-Origin":
        process.env.ENV === "Development"
          ? "http://localhost:5173"
          : "https://woltflow.shalev396.com",
      "Access-Control-Allow-Credentials": "true",
    },
    body: "",
  };
};
