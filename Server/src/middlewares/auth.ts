import jwt from "jsonwebtoken";
import { CustomAPIGatewayProxyHandler } from "../typescript/types/aws";
import { ICustomAPIGatewayProxyEvent } from "../typescript/interfaces/aws";
import { APIGatewayProxyResult, Context } from "aws-lambda";
console.log("authMiddleware");
export const authMiddleware = (
  handler: CustomAPIGatewayProxyHandler
): CustomAPIGatewayProxyHandler => {
  return async (
    event: ICustomAPIGatewayProxyEvent,
    context: Context,
    callback: (error?: Error | null | string, result?: any) => void
  ): Promise<APIGatewayProxyResult> => {
    try {
      const cookieHeader =
        (event.cookies && event.cookies.join("; ")) ||
        event.headers["cookie"] ||
        "";
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
      const payload = jwt.verify(token, process.env["JWT_SECRET"]!) as {
        userId: string;
      };

      // Add userId to both event and context
      event.userId = payload.userId;

      return await handler(event, context, callback);
    } catch (err: any) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: err.message || "Invalid token" }),
      };
    }
  };
};
