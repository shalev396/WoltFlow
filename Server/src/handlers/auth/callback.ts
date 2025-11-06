import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import axios from "axios";
import jwt from "jsonwebtoken";
import { User } from "../../models/index.js";
import { initDB } from "../../config/bootstrap.js";

await initDB();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const code = event.queryStringParameters?.["code"];

    if (!code) {
      throw new Error("No authorization code received");
    }

    // Construct redirect URI (must match what's configured in Cognito)
    const protocol = process.env.IS_LOCAL === "true" ? "http" : "https";
    const domain =
      process.env.IS_LOCAL === "true"
        ? process.env.DOMAIN_NAME_LOCAL
        : process.env.DOMAIN_NAME_CLOUD;
    const redirectUri = `${protocol}://${domain}/auth/callback`;

    // Exchange authorization code for tokens
    const tokenEndpoint = `${process.env.COGNITO_ISSUER}/oauth2/token`;

    const tokenResponse = await axios.post(
      tokenEndpoint,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.COGNITO_CLIENT_ID!,
        code,
        redirect_uri: redirectUri,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { id_token, refresh_token } = tokenResponse.data;

    if (!id_token) {
      throw new Error("No ID token received from token endpoint");
    }

    // Decode token to get user info
    const decoded = jwt.decode(id_token) as jwt.JwtPayload | null;
    if (!decoded || !decoded.sub) {
      throw new Error("Invalid token: missing sub claim");
    }
    const cognitoSub = decoded.sub;
    const userEmail = decoded["email"] as string | undefined;
    const userName = decoded["name"] as string | undefined;

    // Create or update user in database
    await User.upsert({
      cognitoSub,
      email: userEmail || null,
      name: userName || null,
      lastLoginAt: new Date(),
    });

    // Pass tokens to frontend via URL fragment (not visible in server logs)
    // Frontend will extract and store in localStorage
    const tokenParams = new URLSearchParams({
      idToken: id_token,
      refreshToken: refresh_token,
      expiresIn: "3600",
      userId: cognitoSub,
      email: userEmail || "",
      name: userName || "",
    });

    return {
      statusCode: 302,
      headers: {
        // Redirect to auth/success page with tokens in URL fragment
        // Fragment (#) is more secure than query params - not sent to server
        Location: `${protocol}://${domain}/auth/success#${tokenParams.toString()}`,
      },
      body: "",
    };
  } catch (error) {
    console.error("OAuth callback error:", error);

    const protocol = process.env.IS_LOCAL === "true" ? "http" : "https";
    const domain =
      process.env.IS_LOCAL === "true"
        ? process.env.DOMAIN_NAME_LOCAL
        : process.env.DOMAIN_NAME_CLOUD;

    let errorMessage = "Authentication failed";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      statusCode: 302,
      headers: {
        Location: `${protocol}://${domain}/login?error=${encodeURIComponent(
          errorMessage
        )}`,
      },
      body: "",
    };
  }
};
