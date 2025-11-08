import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import axios from "axios";

/**
 * Google OAuth Callback Handler
 *
 * This handler processes the OAuth callback after Google authentication.
 * It exchanges the authorization code for Cognito tokens and creates/updates the user in the database.
 *
 * @param {string} code - OAuth authorization code from query params
 * @returns {APIGatewayProxyResult} User data and authentication tokens
 */
export const handler: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    const code = event.queryStringParameters?.["code"];

    if (!code) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify({
          success: false,
          message: "Authorization code is required",
        }),
      };
    }

    const cognitoDomain = process.env.COGNITO_DOMAIN;
    const cognitoClientId = process.env.COGNITO_CLIENT_ID;
    const region = process.env.AWS_REGION || "us-east-1";

    // Detect if request is coming from localhost
    const origin = event.headers?.["origin"] || event.headers?.["Origin"] || "";
    const referer =
      event.headers?.["referer"] || event.headers?.["Referer"] || "";
    const isLocalRequest =
      origin.includes("localhost") || referer.includes("localhost");

    // Construct the callback URL (must match what was used in auth URL)
    const callbackUrl = isLocalRequest
      ? "http://localhost:5173/auth/callback"
      : `https://${process.env.DOMAIN_NAME}/auth/callback`;

    // Exchange authorization code for tokens
    const tokenEndpoint = `https://${cognitoDomain}.auth.${region}.amazoncognito.com/oauth2/token`;

    const tokenResponse = await axios.post(
      tokenEndpoint,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: cognitoClientId,
        code: code,
        redirect_uri: callbackUrl,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { id_token, access_token, refresh_token, expires_in } =
      tokenResponse.data;

    // Decode the ID token to get user information
    const tokenParts = id_token.split(".");
    const payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString());

    // Extract user information from token
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name || payload.email,
      emailVerified: payload.email_verified || true,
    };

    // Database sync is handled by PostConfirmation trigger - don't duplicate here
    console.log(`✅ Google authentication successful for: ${payload.sub}`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": isLocalRequest
          ? "http://localhost:5173"
          : `https://${process.env.DOMAIN_NAME}`,
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        success: true,
        data: {
          user,
          tokens: {
            idToken: id_token,
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
          },
        },
        message: "Google authentication successful",
      }),
    };
  } catch (error: unknown) {
    console.error("Error processing Google OAuth callback:", error);

    if (axios.isAxiosError(error)) {
      console.error("Cognito token exchange failed:", error.response?.data);
    }

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Google authentication failed",
      }),
    };
  }
};
