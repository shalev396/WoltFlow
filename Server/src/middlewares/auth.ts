import jwt from "jsonwebtoken";
import {
  type CustomAPIGatewayProxyHandler,
  type ICustomAPIGatewayProxyEventAuth,
} from "../types/index.js";
import {
  type Callback,
  type APIGatewayProxyResult,
  type Context,
} from "aws-lambda";
import { getErrorMessage } from "../utils/responseUtil.js";
console.log("authMiddleware");
export const authMiddleware = (
  handler: CustomAPIGatewayProxyHandler
): CustomAPIGatewayProxyHandler => {
  return async (
    event: ICustomAPIGatewayProxyEventAuth,
    context: Context,
    callback: Callback
  ): Promise<APIGatewayProxyResult> => {
    try {
      const cookieHeader =
        (event.cookies && event.cookies.join("; ")) ||
        event.headers.cookie ||
        "";
      console.log("cookieHeader", cookieHeader);
      console.log("event.cookies", event.cookies);
      console.log("event.headers.cookie", event.headers.cookie);
      const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((p) => p.split("="))
      );
      const token = cookies["sessionToken"];

      if (!token) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Not authenticated" }),
        };
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string;
      };

      // Add internal userId (UUID) to event for use throughout the app
      event.userId = payload.userId;

      return await handler(event, context, callback);
    } catch (err) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: getErrorMessage(err) || "Invalid token",
        }),
      };
    }
  };
};
