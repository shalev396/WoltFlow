import { Router } from "express";
import { RunsController } from "../../controllers/index.js";

const router = Router();

// Runs response type
export interface RunsResponseData {
  runs: Array<{
    id: string;
    status: string;
    stage: string;
    automationMode: string;
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
    automationMode: string | null;
  };
}
router.get("/", RunsController.getAllRuns);

export { router as runsRouter };
