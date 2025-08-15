import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sequelize from "../../config/database.js";
import { User } from "../../models/index.js";
import { oauth2_v2 } from "@googleapis/oauth2";
import { syncDatabase } from "../../config/bootstrap.js";
import { createErrorResponse } from "../../utils/responseUtil.js";

// Environment variables
dotenv.config();
const ENV = process.env["ENV"];

let ENV_OAUTH_REDIRECT_URI = "";
let ENV_LOCATION = "";
if (ENV === "prod") {
  ENV_OAUTH_REDIRECT_URI = process.env["OAUTH_REDIRECT_URI_PROD"] || "";
  ENV_LOCATION = "https://woltflow.shalev396.com/dashboard";
} else if (ENV === "dev") {
  ENV_OAUTH_REDIRECT_URI = process.env["OAUTH_REDIRECT_URI_DEV"] || "";
  ENV_LOCATION = "https://dev.woltflow.shalev396.com/dashboard";
} else if (ENV === "local") {
  ENV_OAUTH_REDIRECT_URI = process.env["OAUTH_REDIRECT_URI_LOCAL"] || "";
  ENV_LOCATION = "http://localhost:5173/dashboard";
}

await sequelize.authenticate();
await syncDatabase();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Incoming event:", JSON.stringify(event));
  const oauthRedirectUri = ENV_OAUTH_REDIRECT_URI;

  // 2. Extract 'code' and 'state'
  const code = event.queryStringParameters?.["code"];
  const rawState = event.queryStringParameters?.["state"];
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
  const sessionToken = jwt.sign(
    { userId: user.id },
    process.env["JWT_SECRET"]!,
    {
      expiresIn: "7d",
    }
  );

  // 9. Redirect with HTTP-Only cookie
  return {
    statusCode: 302,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; HttpOnly; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }`,
      Location: ENV_LOCATION,
      "Access-Control-Allow-Credentials": "true",
    },
    body: "",
  };
};
