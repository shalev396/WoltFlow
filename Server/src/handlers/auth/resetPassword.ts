import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

/**
 * Reset Password Handler
 *
 * Confirms the password reset using the verification code sent to user's email.
 *
 * @param {string} email - User's email address
 * @param {string} code - Verification code from email
 * @param {string} password - New password
 * @returns {APIGatewayProxyResult} Success or error message
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
    const { email, code, password } = body;

    if (!email || !code || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: "Email, verification code, and new password are required",
        }),
      };
    }

    await cognitoClient.send(
      new ConfirmForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: password,
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message:
          "Password reset successful. You can now login with your new password.",
      }),
    };
  } catch (error: unknown) {
    console.error("Reset password error:", error);

    // Handle Cognito-specific errors
    if (error instanceof Error) {
      if (error.name === "CodeMismatchException") {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: "Invalid verification code. Please check and try again.",
          }),
        };
      }

      if (error.name === "ExpiredCodeException") {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: "Verification code has expired. Please request a new one.",
          }),
        };
      }

      if (error.name === "InvalidPasswordException") {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message:
              "Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, number, and special character.",
          }),
        };
      }

      if (error.name === "LimitExceededException") {
        return {
          statusCode: 429,
          headers,
          body: JSON.stringify({
            success: false,
            message: "Too many attempts. Please try again later.",
          }),
        };
      }
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: "Failed to reset password. Please try again.",
      }),
    };
  }
};
