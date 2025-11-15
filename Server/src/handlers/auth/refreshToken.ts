import { type APIGatewayProxyHandler } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

/**
 * Refresh token endpoint - exchanges refresh token for new id and access tokens
 * POST /api/auth/refresh
 * Body: { refreshToken: string }
 *
 * This endpoint allows the client to refresh expired id/access tokens
 * without requiring the user to log in again.
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    console.log("🔄 Refresh token request received");

    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};
    const { refreshToken } = body;

    // Validate input
    if (!refreshToken) {
      console.error("❌ Missing refresh token");
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Refresh token is required",
        }),
      };
    }

    // Get Cognito configuration
    const clientId = process.env.COGNITO_CLIENT_ID;
    if (!clientId) {
      console.error("❌ Missing Cognito client ID configuration");
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: "Server configuration error",
        }),
      };
    }

    console.log("🔐 Calling Cognito InitiateAuth with REFRESH_TOKEN_AUTH...");

    // Call Cognito InitiateAuth with REFRESH_TOKEN_AUTH flow
    const authParams: InitiateAuthCommandInput = {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };

    const command = new InitiateAuthCommand(authParams);
    const response = await cognitoClient.send(command);

    // Validate response
    if (!response.AuthenticationResult) {
      console.error("❌ No authentication result from Cognito");
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: "Failed to refresh tokens",
        }),
      };
    }

    const { IdToken, AccessToken, ExpiresIn } = response.AuthenticationResult;

    if (!IdToken) {
      console.error("❌ No ID token in Cognito response");
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: "Failed to refresh tokens",
        }),
      };
    }

    console.log("✅ Tokens refreshed successfully");

    // Return new tokens
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Tokens refreshed successfully",
        data: {
          idToken: IdToken,
          accessToken: AccessToken || "",
          expiresIn: ExpiresIn || 3600, // Default to 1 hour if not provided
        },
      }),
    };
  } catch (error: unknown) {
    console.error("❌ Token refresh failed:", error);

    // Check for specific Cognito errors
    if (error.name === "NotAuthorizedException") {
      console.error("❌ Refresh token expired or invalid");
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: "Refresh token expired or invalid",
        }),
      };
    }

    if (error.name === "UserNotFoundException") {
      console.error("❌ User not found");
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: "User not found",
        }),
      };
    }

    // Generic error response
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Failed to refresh tokens",
      }),
    };
  }
};
