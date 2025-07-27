import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
import sequelize from "../../config/database.js";
import Run from "../../models/Run.js";
import Screenshot from "../../models/Screenshot.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { Op } from "sequelize";
import { ICustomAPIGatewayProxyEvent } from "../../typescript/interfaces/aws.js";
import { syncDatabase } from "../../config/bootstrap.js";
// Connect to database
await sequelize.authenticate();
await syncDatabase();

interface QueryParams {
  page?: string;
  limit?: string;
  status?: "failed" | "in progress" | "success";
  stage?:
    | "triggered"
    | "refreshing tokens"
    | "buying gift"
    | "getting code from mail"
    | "applying gift"
    | "done";
  minAmount?: string;
  maxAmount?: string;
  isNotify?: string;
}

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEvent) => {
    try {
      await sequelize.authenticate();

      const queryParams = event.queryStringParameters || ({} as QueryParams);

      // Pagination parameters
      const page = parseInt(queryParams.page || "1", 10);
      const limit = Math.min(parseInt(queryParams.limit || "10", 10), 50); // Max 50 items per page
      const offset = (page - 1) * limit;

      // Build where clause for filtering
      const whereClause: any = {
        user_id: event.userId,
      };

      // Status filter
      if (queryParams.status) {
        whereClause.status = queryParams.status;
      }

      // Stage filter
      if (queryParams.stage) {
        whereClause.stage = queryParams.stage;
      }

      // Amount range filter
      if (queryParams.minAmount || queryParams.maxAmount) {
        whereClause.amount = {};
        if (queryParams.minAmount) {
          whereClause.amount[Op.gte] = parseFloat(queryParams.minAmount);
        }
        if (queryParams.maxAmount) {
          whereClause.amount[Op.lte] = parseFloat(queryParams.maxAmount);
        }
      }

      // Notification filter
      if (queryParams.isNotify !== undefined) {
        whereClause.is_notify = queryParams.isNotify === "true";
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
            attributes: ["id", "url", "is_error"],
            required: false,
          },
        ],
        order: [["created_at", "DESC"]], // Newest first
        limit,
        offset,
        attributes: [
          "id",
          "status",
          "stage",
          "amount",
          "is_notify",
          "created_at",
          "updated_at",
        ],
      });

      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify({
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
            minAmount: queryParams.minAmount
              ? parseFloat(queryParams.minAmount)
              : null,
            maxAmount: queryParams.maxAmount
              ? parseFloat(queryParams.maxAmount)
              : null,
            isNotify: queryParams.isNotify
              ? queryParams.isNotify === "true"
              : null,
          },
        }),
      };
    } catch (error) {
      console.error("Error in getUserRuns:", error);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify({ error: "Failed to fetch runs" }),
      };
    }
  }
);
