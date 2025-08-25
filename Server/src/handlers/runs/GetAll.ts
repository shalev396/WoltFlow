import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
import sequelize from "../../config/database.js";
import { Run, Screenshot } from "../../models/index.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { ICustomAPIGatewayProxyEventAuth } from "../../typescript/interfaces/aws.js";
import { syncDatabase } from "../../config/bootstrap.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../utils/responseUtil.js";

// Connect to database
await sequelize.authenticate();
await syncDatabase();
interface QueryParams {
  page?: string;
  limit?: string;
  status?: "started" | "in_progress" | "completed" | "failed";
  stage?:
    | "triggered"
    | "refreshing_tokens"
    | "buying_gift"
    | "getting_code_from_email"
    | "applying_gift"
    | "completed";
  automationMode?: "full-run" | "buy-only" | "cross-account";
}

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
    try {
      await sequelize.authenticate();

      const queryParams = event.queryStringParameters || ({} as QueryParams);

      // Pagination parameters
      const page = parseInt(queryParams.page || "1", 10);
      const limit = Math.min(parseInt(queryParams.limit || "10", 10), 50); // Max 50 items per page
      const offset = (page - 1) * limit;

      // Build where clause for filtering - using any for dynamic query building
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereClause: any = {
        userId: event.userId,
      };

      // Status filter
      if (queryParams.status) {
        whereClause.status = queryParams.status;
      }

      // Stage filter
      if (queryParams.stage) {
        whereClause.stage = queryParams.stage;
      }

      // Automation mode filter
      if (queryParams.automationMode) {
        whereClause.automationMode = queryParams.automationMode;
      }

      // Get total count for pagination
      const totalCount = await Run.count({
        where: whereClause,
      });

      // Get runs with screenshots
      const runs = await Run.findAll({
        where: whereClause,
        include: [
          {
            model: Screenshot,
            as: "screenshots",
            attributes: [
              "id",
              "siteUrl",
              "screenshotUrl",
              "isError",
              "screenshotType",
            ],
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]], // Newest first
        limit,
        offset,
        attributes: [
          "id",
          "status",
          "stage",
          "automationMode",
          "errorMessage",
          "createdAt",
          "updatedAt",
        ],
      });

      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return createSuccessResponse("Runs retrieved successfully", {
        runs,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null,
        },
        filters: {
          status: queryParams.status || null,
          stage: queryParams.stage || null,
          automationMode: queryParams.automationMode || null,
        },
      });
    } catch (error) {
      console.error("Error in getUserRuns:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
