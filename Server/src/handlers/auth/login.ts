import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import jwt from "jsonwebtoken";
import { User } from "../../models/index.js";
import { initDB } from "../../config/bootstrap.js";

await initDB();

const cognitoClient = new CognitoIdentityProviderClient({});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { email, password } = JSON.parse(event.body || "{}");

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Email and password are required",
        }),
      };
    }

    const result = await cognitoClient.send(
      new InitiateAuthCommand({
        ClientId: process.env.COGNITO_CLIENT_ID!,
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      })
    );

    const idToken = result.AuthenticationResult?.IdToken;
    const refreshToken = result.AuthenticationResult?.RefreshToken;

    if (!idToken) {
      throw new Error("No ID token received from Cognito");
    }

    // Decode token to get user info
    const decoded = jwt.decode(idToken) as jwt.JwtPayload | null;
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

    // Return tokens in response body for frontend to store in localStorage
    // and send via Authorization header on subsequent requests
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: cognitoSub,
            email: userEmail || "",
            name: userName || "",
          },
          tokens: {
            idToken: idToken,
            refreshToken: refreshToken,
            expiresIn: 3600, // 1 hour in seconds
          },
        },
      }),
    };
  } catch (error) {
    console.error("Login error:", error);
    let errorMessage = "Login failed";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      statusCode: 401,
      body: JSON.stringify({
        success: false,
        message: errorMessage,
      }),
    };
  }
};
