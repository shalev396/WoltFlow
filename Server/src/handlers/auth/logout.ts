import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import dotenv from "dotenv";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../utils/responseUtil.js";

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
