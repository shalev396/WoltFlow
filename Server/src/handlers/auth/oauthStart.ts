import { type APIGatewayProxyResultV2 } from "aws-lambda";
import { type GenerateAuthUrlOpts, OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

// Environment variables
dotenv.config();
export const handler = async (): Promise<APIGatewayProxyResultV2> => {
  // 1. Create OAuth2 client
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI
  );

  // 2. Generate PKCE verifier & challenge
  const { codeVerifier, codeChallenge } =
    await oauth2Client.generateCodeVerifierAsync(); // convenience PKCE helper

  // 3. Pack verifier into state (we’ll parse this on callback)
  const state = JSON.stringify({ codeVerifier });

  // 4. Build consent URL
  const consentUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    code_challenge_method: "S256",
    code_challenge: codeChallenge!,
    state, // will be URL-encoded by the library
  } as GenerateAuthUrlOpts);

  // 5. Redirect user
  return {
    statusCode: 302,
    headers: {
      Location: consentUrl,
      "Access-Control-Allow-Credentials": "true",
    },
    body: "",
  };
};
