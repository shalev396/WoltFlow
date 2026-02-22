import { type RequestHandler } from "express";
import { Run } from "../classes/index.js";
import { type AuthenticatedRequest } from "../types/express.js";

export class RunsController {
  static getAllRuns: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest & {
        query: {
          page?: string;
          limit?: string;
          status?: string;
          stage?: string;
          automationMode?: string;
        };
      };
      const userId = authReq.user.id;

      const page = parseInt(authReq.query.page || "1", 10);
      const limit = Math.min(parseInt(authReq.query.limit || "10", 10), 50);

      const data = await Run.getAllPaginated(userId, {
        page,
        limit,
        ...(authReq.query.status ? { status: authReq.query.status } : {}),
        ...(authReq.query.stage ? { stage: authReq.query.stage } : {}),
        ...(authReq.query.automationMode ? { automationMode: authReq.query.automationMode } : {}),
      });

      res.success(data);
    } catch (error) {
      console.error("Error in getUserRuns:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retrieve runs";
      res.error(errorMessage, 500);
    }
  };
}
