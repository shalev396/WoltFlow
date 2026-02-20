import { Router } from "express";
import { DashboardController } from "../../controllers/index.js";

const router = Router();

// Dashboard response type
export interface DashboardResponseData {
  analytics: {
    timeRange: string;
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    inProgressRuns: number;
    successRate: number;
    totalSavings: number;
    averageSavingsPerRun: number;
    daysSinceLastRun: number | null;
    chartData: Array<{
      date: string;
      savings: number;
      dailyAmount: number;
      runCount: number;
    }>;
    recentRuns: Array<{
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
    trendComparison: {
      previousPeriodRuns: number;
      previousPeriodSavings: number;
      runsGrowthPercentage: number;
      savingsGrowthPercentage: number;
    };
  };
}

router.get("/", DashboardController.getDashboard);

export { router as dashboardRouter };
