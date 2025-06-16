import { APIGatewayProxyHandler } from "aws-lambda";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

export const handler: APIGatewayProxyHandler = async () => {
  const isDev = process.env.ENV === "Development";
  const oauthRedirectUri = isDev
    ? process.env.OAUTH_REDIRECT_URI_DEV!
    : process.env.OAUTH_REDIRECT_URI!;
  // 1. Create OAuth2 client
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    oauthRedirectUri
  );

  // 2. Generate PKCE verifier & challenge
  const { codeVerifier, codeChallenge } =
    await oauth2Client.generateCodeVerifierAsync(); // convenience PKCE helper :contentReference[oaicite:2]{index=2}

  // 3. Pack verifier into state (we’ll parse this on callback)
  const state = JSON.stringify({ codeVerifier });

  // 4. Build consent URL
  const consentUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    code_challenge_method: "S256" as any,
    code_challenge: codeChallenge,
    state, // will be URL-encoded by the library
  });

  // 5. Redirect user
  return {
    statusCode: 302,
    headers: {
      Location: consentUrl,
      "Access-Control-Allow-Origin":
        process.env.ENV === "Development"
          ? "http://localhost:5173"
          : "https://woltflow.shalev396.com",
      "Access-Control-Allow-Credentials": "true",
    },
    body: "",
  };
};
