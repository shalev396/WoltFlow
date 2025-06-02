import { APIGatewayProxyHandler } from "aws-lambda";
import {
  corsHeaders,
  errorHandler,
  authMiddleware,
} from "../../utils/middleware";
import Run from "../../models/Run";
import { CustomRequest } from "../../types";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const authResult = await authMiddleware(event);
    if ("statusCode" in authResult) {
      return authResult;
    }

    const request = authResult as CustomRequest;
    const userId = event.pathParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "User ID is required",
          statusCode: 400,
        }),
      };
    }

    // Verify user can only access their own runs
    if (request.user?.userId.toString() !== userId) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Unauthorized access",
          statusCode: 403,
        }),
      };
    }

    const runs = await Run.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(runs),
    };
  } catch (error) {
    return errorHandler(error);
  }
};
