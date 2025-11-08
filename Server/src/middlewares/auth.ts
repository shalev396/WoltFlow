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
import { User } from "../models/index.js";
import { initDB } from "../config/bootstrap.js";

// Connect to database
await initDB();

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

      let cognitoSub: string;

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
        console.log("✅ Using API Gateway JWT validation (Production)");
        cognitoSub = requestContext.authorizer.jwt.claims.sub;
      } else {
        // Local environment - validate token manually from Authorization header
        console.log("⚠️  Using middleware JWT validation (Local Development)");
        console.log(
          "   If you see this in CloudWatch for production, API Gateway authorizer is not working!"
        );

        // Get token from Authorization header
        const authHeader =
          event.headers.authorization || event.headers.Authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return {
            statusCode: 401,
            body: JSON.stringify({
              success: false,
              message:
                "Missing or invalid Authorization header. Expected: Bearer <token>",
            }),
          };
        }

        const token = authHeader.substring(7);

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
        cognitoSub = claims.sub;
      }

      // Look up user by cognitoSub to get the actual User.id (UUID)
      const user = await User.findOne({
        where: { cognitoSub },
        attributes: ["id", "cognitoSub"],
      });

      if (!user) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            success: false,
            message: "User not found",
          }),
        };
      }

      // Attach both userId (UUID) and cognitoSub to the event
      event.userId = user.id;
      event.cognitoSub = cognitoSub;

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
