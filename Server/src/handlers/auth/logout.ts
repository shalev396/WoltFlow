import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import dotenv from "dotenv";
import "../../config/bootstrap.js";

// Environment variables
dotenv.config();

const ENV = process.env["ENV"];

export const handler = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Clear the session cookie by setting Max-Age to 0
    const cookieSettings =
      ENV === "local"
        ? "HttpOnly; SameSite=Lax; Path=/"
        : "HttpOnly; Secure; SameSite=Strict; Path=/";

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `sessionToken=; ${cookieSettings}; Max-Age=0`,

        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({ message: "Logged out successfully" }),
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({ error: "Failed to logout" }),
    };
  }
};
