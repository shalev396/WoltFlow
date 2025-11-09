import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

/**
 * Forgot Password Handler
 *
 * Initiates the forgot password flow by sending a verification code to the user's email.
 *
 * @param {string} email - User's email address
 * @returns {APIGatewayProxyResult} Success message with instructions
 */
export const handler: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
  };

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { email } = body;

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: "Email is required",
        }),
      };
    }

    await cognitoClient.send(
      new ForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message:
          "Password reset code sent to your email. Please check your inbox.",
      }),
    };
  } catch (error: unknown) {
    console.error("Forgot password error:", error);

    // Handle Cognito-specific errors
    if (error instanceof Error) {
      if (error.name === "UserNotFoundException") {
        // Don't reveal if user exists - security best practice
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message:
              "If an account exists with this email, you will receive a password reset code.",
          }),
        };
      }

      if (error.name === "LimitExceededException") {
        return {
          statusCode: 429,
          headers,
          body: JSON.stringify({
            success: false,
            message: "Too many requests. Please try again later.",
          }),
        };
      }
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: "Failed to initiate password reset. Please try again.",
      }),
    };
  }
};
