import { Router } from "express";
import { RunsController } from "../../controllers/index.js";
import type {
  ManualRunIssue,
  ManualRunCooldown,
} from "../../utils/manualRun.js";

const router = Router();

export interface RunsResponseData {
  runs: Array<{
    id: string;
    status: string;
    stage: string;
    amount: string | null;
    errorMessage: string | null;
    createdAt: Date;
    updatedAt: Date;
    screenshots: Array<{
      id: string;
      siteUrl: string;
      screenshotUrl: string;
      isError: boolean;
      screenshotType: string;
    }>;
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  filters: {
    status: string | null;
    stage: string | null;
  };
}

/** GET /api/user/runs/manual */
export interface ManualRunStatusResponseData {
  featureEnabled: boolean;
  eligible: boolean;
  issues: ManualRunIssue[];
  cooldown: ManualRunCooldown | null;
}

/** POST /api/user/runs/manual */
export interface TriggerManualRunResponseData {
  runId: string;
}

export interface TriggerManualRunErrorData {
  issues: ManualRunIssue[];
  cooldown?: ManualRunCooldown | null;
}

router.get("/", RunsController.getAllRuns);
router.get("/manual", RunsController.getManualRunStatus);
router.post("/manual", RunsController.triggerManualRun);

export { router as runsRouter };
