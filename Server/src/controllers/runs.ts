import { type RequestHandler } from "express";
import { Run } from "../classes/index.js";
import { type AuthenticatedRequest } from "../types/express.js";
import { evaluateManualRun } from "../utils/manualRun.js";
import { startAutomationExecution } from "../utils/automationChain.js";

export class RunsController {
  static getAllRuns: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest & {
        query: {
          page?: string;
          limit?: string;
          status?: string;
          stage?: string;
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
      });

      res.success(data);
    } catch (error) {
      console.error("Error in getUserRuns:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retrieve runs";
      res.error(errorMessage, 500);
    }
  };

  static getManualRunStatus: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const status = await evaluateManualRun(authReq.user.id);

      // Client-facing payload: omit internal fire helpers.
      res.success({
        featureEnabled: status.featureEnabled,
        eligible: status.eligible,
        issues: status.issues,
        cooldown: status.cooldown,
      });
    } catch (error) {
      console.error("Error in getManualRunStatus:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to retrieve manual run status";
      res.error(errorMessage, 500);
    }
  };

  static triggerManualRun: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const status = await evaluateManualRun(userId);

      if (!status.featureEnabled) {
        res.error("Manual run feature is currently disabled", 403);
        return;
      }

      if (status.issues.length > 0) {
        const hasCooldown = status.issues.some(
          (i) => i.code === "cooldown_active",
        );
        if (hasCooldown && status.cooldown) {
          res.setHeader(
            "Retry-After",
            String(status.cooldown.retryAfterSeconds),
          );
          res.status(429).json({
            success: false,
            message: "Manual run cooldown is active. Please try again later.",
            data: { issues: status.issues, cooldown: status.cooldown },
          });
          return;
        }

        res.status(400).json({
          success: false,
          message: "Manual run requirements are not met",
          data: { issues: status.issues },
        });
        return;
      }

      if (status.giftAmount === null) {
        // Should be unreachable when eligible; defensive guard.
        res.status(400).json({
          success: false,
          message: "Manual run requirements are not met",
          data: { issues: [{ code: "missing_gift_amount" }] },
        });
        return;
      }

      const newRun = await Run.createForAutomation(userId, status.giftAmount);

      await startAutomationExecution(
        [
          {
            userId,
            runId: newRun.id,
            giftAmount: status.giftAmount,
            isNotification: status.isNotificationEnabled,
          },
        ],
        `manual-user-${userId}`,
      );

      res.success({ runId: newRun.id });
    } catch (error) {
      console.error("Error in triggerManualRun:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start manual run";
      res.error(errorMessage, 500);
    }
  };
}
