import dotenv from "dotenv";
import { type APIGatewayProxyResult } from "aws-lambda";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../utils/responseUtil.js";

// Environment variables
dotenv.config();

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    // Clear the session cookie by setting Max-Age to 0
    const cookieSettings =
      process.env.ENV === "local"
        ? "HttpOnly; SameSite=Lax; Path=/"
        : "HttpOnly; Secure; SameSite=Strict; Path=/";

    const successResponse = createSuccessResponse("Logged out successfully");
    // Add cookie clearing header
    successResponse.headers = {
      ...successResponse.headers,
      "Set-Cookie": `sessionToken=; ${cookieSettings}; Max-Age=0`,
    };
    return successResponse;
  } catch (error) {
    console.error("Logout error:", error);
    return createErrorResponse(getErrorMessage(error));
  }
};
