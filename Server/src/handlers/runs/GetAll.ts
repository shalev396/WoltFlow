import {
  type ICustomAPIGatewayProxyEventPaginateForRun,
  type RunWithScreenshots,
  type CustomAPIGatewayProxyHandler,
} from "../../types/index.js";
import { initDB } from "../../config/bootstrap.js";
import { Run, Screenshot } from "../../models/index.js";
import { authMiddleware } from "../../middlewares/auth.js";

import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../utils/responseUtil.js";
import { type Attributes, type WhereOptions } from "sequelize";

// Connect to database
await initDB();
export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventPaginateForRun) => {
    try {
      const queryParams = event.queryStringParameters || {};

      // Pagination parameters
      const page = parseInt(queryParams.page || "1", 10);
      const limit = Math.min(parseInt(queryParams.limit || "10", 10), 50); // Max 50 items per page
      const offset = (page - 1) * limit;
      const { status, stage, automationMode } = queryParams;
      const whereClause: WhereOptions<Attributes<Run>> = {
        userId: event.userId,
        ...(status ? { status: status as Run["status"] } : {}),
        ...(stage ? { stage: stage as Run["stage"] } : {}),
        ...(automationMode
          ? { automationMode: automationMode as Run["automationMode"] }
          : {}),
      };

      // Get total count for pagination
      const totalCount = await Run.count({
        where: whereClause,
      });

      // Get runs with screenshots
      const runs = (await Run.findAll({
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
      })) as RunWithScreenshots[];

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
