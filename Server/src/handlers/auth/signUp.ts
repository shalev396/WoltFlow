import {type APIGatewayProxyEvent, type APIGatewayProxyResult } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { email, password, name } = JSON.parse(event.body || "{}");

    if (!email || !password || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Email, password, and name are required",
        }),
      };
    }

    const result = await cognitoClient.send(
      new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID!,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: name },
        ],
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message:
          "User registered successfully. Please check your email to verify your account.",
        data: {
          userSub: result.UserSub,
          userConfirmed: result.UserConfirmed,
        },
      }),
    };
  } catch (error) {
    console.error("Signup error:", error);
    let errorMessage = "Signup failed";
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
