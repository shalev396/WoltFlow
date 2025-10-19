import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { email, code } = JSON.parse(event.body || "{}");

    if (!email || !code) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Email and verification code are required",
        }),
      };
    }

    await cognitoClient.send(
      new ConfirmSignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID!,
        Username: email,
        ConfirmationCode: code,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Email verified successfully. You can now log in.",
      }),
    };
  } catch (error) {
    console.error("Confirmation error:", error);
    let errorMessage = "Email verification failed";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: errorMessage,
      }),
    };
  }
};
