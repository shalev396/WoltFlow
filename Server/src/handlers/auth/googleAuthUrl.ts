import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";

/**
 * Google OAuth URL Generator Handler
 *
 * This handler generates the Google OAuth authorization URL for initiating
 * the Google sign-in flow via AWS Cognito.
 *
 * Flow:
 * 1. Frontend calls this endpoint
 * 2. Receives Cognito-hosted OAuth URL
 * 3. Redirects user to Google for authentication
 * 4. Google redirects back to Cognito
 * 5. Cognito redirects to frontend callback URL
 *
 * @returns {APIGatewayProxyResult} OAuth authorization URL
 */
export const handler: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    const cognitoDomain = process.env.COGNITO_DOMAIN;
    const cognitoClientId = process.env.COGNITO_CLIENT_ID;
    const region = process.env.AWS_REGION;

    // Detect if request is coming from localhost by checking the origin header
    const origin = event.headers?.["origin"] || event.headers?.["Origin"] || "";
    const isLocalRequest =
      origin.includes("localhost") || origin.includes("127.0.0.1");

    // Construct the callback URL based on where the request came from
    const callbackUrl = isLocalRequest
      ? "http://localhost:5173/auth/callback"
      : `https://${process.env.DOMAIN_NAME}/auth/callback`;

    // Construct the Cognito OAuth URL
    // This URL will redirect to Google for authentication
    const authUrl =
      `https://${cognitoDomain}.auth.${region}.amazoncognito.com/oauth2/authorize?` +
      `client_id=${cognitoClientId}&` +
      `response_type=code&` +
      `scope=email+openid+profile&` +
      `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
      `identity_provider=Google`;

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
          authUrl,
        },
        message: "Google OAuth URL generated successfully",
      }),
    };
  } catch (error: unknown) {
    console.error("Error generating Google OAuth URL:", error);

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
            : "Failed to generate Google OAuth URL",
      }),
    };
  }
};
