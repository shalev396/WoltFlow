import jwt from "jsonwebtoken";
import { CustomAPIGatewayProxyHandler } from "../typescript/types/aws";
import { IAuthenticatedEvent } from "../typescript/interfaces/auth";
import {
  ICustomAPIGatewayProxyEvent,
  ICustomContext,
} from "../typescript/interfaces/aws";
import { APIGatewayProxyResult } from "aws-lambda";

export const authMiddleware = (
  handler: CustomAPIGatewayProxyHandler
): CustomAPIGatewayProxyHandler => {
  return async (
    event: ICustomAPIGatewayProxyEvent,
    context: ICustomContext,
    callback: (error?: Error | null | string, result?: any) => void
  ): Promise<APIGatewayProxyResult> => {
    try {
      const cookieHeader = event.headers.Cookie || event.headers.cookie || "";
      const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((pair: string) => pair.split("="))
      );
      const token = cookies["sessionToken"];
      if (!token) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Not authenticated" }),
        };
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };

      // Add userId to both event and context
      event.userId = payload.userId;
      context.userId = payload.userId;

      return await handler(event as IAuthenticatedEvent, context, callback);
    } catch (err: any) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: err.message || "Invalid token" }),
      };
    }
  };
};
