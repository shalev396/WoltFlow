import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyResult,
} from "aws-lambda";
import { oauth2_v2 } from "@googleapis/oauth2";
import { type GetTokenOptions, OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { User } from "../../models/index.js";
import { createErrorResponse } from "../../utils/responseUtil.js";
import { initDB } from "../../config/bootstrap.js";

// Environment variables
dotenv.config();
await initDB();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // 2. Extract 'code' and 'state'
  const code = event.queryStringParameters?.["code"] || "";
  const rawState = event.queryStringParameters?.["state"] || "";
  if (!code || !rawState) {
    return createErrorResponse("Missing code or state", 400);
  }

  // 3. Parse our JSON-packed verifier out of state
  let codeVerifier: string;
  try {
    codeVerifier = JSON.parse(rawState).codeVerifier;
  } catch {
    return createErrorResponse("Invalid state format", 400);
  }

  // 4. Exchange code + PKCE verifier for tokens
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI
  );
  const { tokens } = await oauth2Client.getToken({
    code,
    codeVerifier,
    redirectUri: process.env.OAUTH_REDIRECT_URI,
  } as GetTokenOptions);
  const { access_token, refresh_token } = tokens;
  if (!refresh_token) {
    return createErrorResponse("No refresh token returned", 400);
  }

  // 5. Fetch user info
  oauth2Client.setCredentials({ access_token: access_token! });
  const oauth2 = new oauth2_v2.Oauth2({
    auth: oauth2Client,
    // version: "v2"
  });
  const userInfo = await oauth2.userinfo.get();
  const googleId = userInfo.data.id!;
  const name = userInfo.data.name || null;
  const email = userInfo.data.email || null;

  // 6. Upsert user in PostgreSQL with name and email
  // This will create new users or update existing ones with fresh Google data
  await User.upsert({
    googleId: googleId,
    googleRefreshToken: refresh_token,
    name,
    email,
  });

  // 7. Get the user record to retrieve internal UUID
  const user = await User.findOne({ where: { googleId } });
  if (!user) {
    return createErrorResponse("Failed to create/find user", 500);
  }

  // 8. Create 7-day session JWT with internal UUID (not Google ID)
  const sessionToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // 9. Redirect with HTTP-Only cookie
  return {
    statusCode: 302,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; HttpOnly; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }`,
      Location: `${process.env.ENV === "dev" ? "http" : "https"}://${
        process.env.DOMAIN_NAME
      }/dashboard`,
    },
    body: "",
  };
};
