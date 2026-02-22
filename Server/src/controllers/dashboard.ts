import { type RequestHandler } from "express";
import { Run } from "../classes/index.js";
import { type AuthenticatedRequest } from "../types/express.js";

export class DashboardController {
  static getDashboard: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest & {
        query: { timeRange?: string };
      };
      const userId = authReq.user.id;
      const timeRange = authReq.query.timeRange || "30d";

      const data = await Run.getDashboardData(userId, timeRange);
      res.success(data);
    } catch (error) {
      console.error("Error in dashboard analytics handler:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retrieve dashboard";
      res.error(errorMessage, 500);
    }
  };
}
