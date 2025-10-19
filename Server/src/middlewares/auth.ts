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
import { verifyToken } from "../utils/cognitoUtil.js";

export const authMiddleware = (
  handler: CustomAPIGatewayProxyHandler
): CustomAPIGatewayProxyHandler => {
  return async (
    event: ICustomAPIGatewayProxyEventAuth,
    context: Context,
    callback: Callback
  ): Promise<APIGatewayProxyResult> => {
    try {
      console.log("authMiddleware start");

      // Check if already authenticated by API Gateway (cloud environment)
      // API Gateway puts JWT claims in requestContext.authorizer.jwt.claims
      const requestContext = event.requestContext as unknown as {
        authorizer?: {
          jwt?: {
            claims?: {
              sub?: string;
            };
          };
        };
      };
      if (requestContext?.authorizer?.jwt?.claims?.sub) {
        console.log("Using API Gateway JWT validation");
        event.userId = requestContext.authorizer.jwt.claims.sub;
        return await handler(event, context, callback);
      }

      // Local environment - validate token manually
      console.log("Using middleware JWT validation (local)");

      const cookieHeader =
        (event.cookies && event.cookies.join("; ")) ||
        event.headers.cookie ||
        "";

      const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((p) => p.split("="))
      );

      const token = cookies["idToken"];

      if (!token) {
        return {
          statusCode: 401,
          body: JSON.stringify({
            success: false,
            message: "Not authenticated",
          }),
        };
      }

      // Verify Cognito token and get claims
      const claims = await verifyToken(token);

      // Extract cognitoSub from token
      if (!claims.sub) {
        return {
          statusCode: 401,
          body: JSON.stringify({
            success: false,
            message: "Invalid token: missing sub claim",
          }),
        };
      }
      event.userId = claims.sub;

      return await handler(event, context, callback);
    } catch (err) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: getErrorMessage(err) || "Invalid token",
        }),
      };
    }
  };
};
