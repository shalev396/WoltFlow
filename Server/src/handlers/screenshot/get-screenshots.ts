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
    const runId = event.pathParameters?.runId;

    if (!runId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Run ID is required",
          statusCode: 400,
        }),
      };
    }

    // Verify the run belongs to the authenticated user
    const run = await Run.findByPk(runId);
    if (!run) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Run not found",
          statusCode: 404,
        }),
      };
    }

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

    const screenshots = await Screenshot.findAll({
      where: { run_id: runId },
      order: [["id", "ASC"]],
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(screenshots),
    };
  } catch (error) {
    return errorHandler(error);
  }
};
