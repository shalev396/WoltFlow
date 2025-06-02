import { APIGatewayProxyHandler } from "aws-lambda";
import {
  corsHeaders,
  errorHandler,
  authMiddleware,
} from "../../utils/middleware";
import Screenshot from "../../models/Screenshot";
import Run from "../../models/Run";
import { CustomRequest } from "../../types";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const authResult = await authMiddleware(event);
    if ("statusCode" in authResult) {
      return authResult;
    }

    const request = authResult as CustomRequest;
    const screenshotId = event.pathParameters?.id;

    if (!screenshotId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Screenshot ID is required",
          statusCode: 400,
        }),
      };
    }

    const screenshot = await Screenshot.findByPk(screenshotId, {
      include: [Run],
    });

    if (!screenshot) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Screenshot not found",
          statusCode: 404,
        }),
      };
    }

    // Verify the screenshot belongs to the authenticated user through the run
    const run = screenshot.get("Run") as Run;
    if (run.user_id !== request.user?.userId) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Unauthorized access",
          statusCode: 403,
        }),
      };
    }

    await screenshot.destroy();

    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  } catch (error) {
    return errorHandler(error);
  }
};
