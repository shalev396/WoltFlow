import { Op } from "sequelize";
import { Run, Screenshot } from "../../models/index.js";
import { authMiddleware } from "../../middlewares/auth.js";
import {
  ICustomAPIGatewayProxyEventDashboard,
  type CustomAPIGatewayProxyHandler,
  type RunWithScreenshots,
} from "../../types/index.js";
import { initDB } from "../../config/bootstrap.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../utils/responseUtil.js";

// Connect to database
await initDB();

interface DashboardAnalytics {
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
  recentRuns: RunWithScreenshots[];
  trendComparison: {
    previousPeriodRuns: number;
    previousPeriodSavings: number;
    runsGrowthPercentage: number;
    savingsGrowthPercentage: number;
  };
}

/**
 * Get dashboard analytics for a user
 * Query params: timeRange (7d, 30d, 90d) - defaults to 30d
 */
export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventDashboard) => {
    try {
      const userId = event.userId!;
      const queryParams = event.queryStringParameters || {};
      const timeRange = queryParams.timeRange || "30d";

      // Parse time range
      const timeRangeMap: Record<string, number> = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
      };

      const days = timeRangeMap[timeRange];
      if (!days) {
        return createErrorResponse(
          "Invalid time range. Use 7d, 30d, or 90d",
          400
        );
      }

      console.log(
        `Getting dashboard analytics for user ${userId}, timeRange: ${timeRange}`
      );

      // Calculate date ranges
      const now = new Date();
      const currentPeriodStart = new Date(
        now.getTime() - days * 24 * 60 * 60 * 1000
      );
      const previousPeriodStart = new Date(
        currentPeriodStart.getTime() - days * 24 * 60 * 60 * 1000
      );

      // Get runs for current period
      const currentPeriodRuns = await Run.findAll({
        where: {
          userId,
          createdAt: {
            [Op.gte]: currentPeriodStart,
            [Op.lte]: now,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      // Get runs for previous period (for comparison)
      const previousPeriodRuns = await Run.findAll({
        where: {
          userId,
          createdAt: {
            [Op.gte]: previousPeriodStart,
            [Op.lt]: currentPeriodStart,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      // Get recent runs with screenshots (for the runs table)
      const recentRunsLimit = 10;
      const recentRuns = (await Run.findAll({
        where: {
          userId,
          createdAt: {
            [Op.gte]: currentPeriodStart,
            [Op.lte]: now,
          },
        },
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
        order: [["createdAt", "DESC"]],
        limit: recentRunsLimit,
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

      // Calculate basic metrics
      const totalRuns = currentPeriodRuns.length;
      const successfulRuns = currentPeriodRuns.filter(
        (run) => run.status === "completed"
      );
      const failedRuns = currentPeriodRuns.filter(
        (run) => run.status === "failed"
      );
      const inProgressRuns = currentPeriodRuns.filter(
        (run) => run.status === "in_progress" || run.status === "started"
      );

      const successfulRunsCount = successfulRuns.length;
      const failedRunsCount = failedRuns.length;
      const inProgressRunsCount = inProgressRuns.length;
      const successRate =
        totalRuns > 0 ? Math.round((successfulRunsCount / totalRuns) * 100) : 0;

      // Calculate savings (₪40 per successful full-run, ₪0 for buy-only)
      const averageSavingsPerRun = 40; // ILS per successful run
      const totalSavings = successfulRunsCount * averageSavingsPerRun;

      // Calculate days since last run
      const lastRun =
        currentPeriodRuns.length > 0 ? currentPeriodRuns[0] : null;
      const daysSinceLastRun = lastRun
        ? Math.floor(
            (now.getTime() - new Date(lastRun.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

      // Generate chart data (daily aggregation)
      const chartData = generateChartData(
        currentPeriodRuns,
        days,
        averageSavingsPerRun
      );

      // Calculate trend comparison
      const previousPeriodRunsCount = previousPeriodRuns.length;
      const previousPeriodSuccessfulRuns = previousPeriodRuns.filter(
        (run) => run.status === "completed"
      ).length;
      const previousPeriodSavings =
        previousPeriodSuccessfulRuns * averageSavingsPerRun;

      const runsGrowthPercentage = calculateGrowthPercentage(
        previousPeriodRunsCount,
        totalRuns
      );
      const savingsGrowthPercentage = calculateGrowthPercentage(
        previousPeriodSavings,
        totalSavings
      );

      const analytics: DashboardAnalytics = {
        timeRange,
        totalRuns,
        successfulRuns: successfulRunsCount,
        failedRuns: failedRunsCount,
        inProgressRuns: inProgressRunsCount,
        successRate,
        totalSavings,
        averageSavingsPerRun,
        daysSinceLastRun,
        chartData,
        recentRuns,
        trendComparison: {
          previousPeriodRuns: previousPeriodRunsCount,
          previousPeriodSavings,
          runsGrowthPercentage,
          savingsGrowthPercentage,
        },
      };

      console.log(`Dashboard analytics calculated for user ${userId}:`, {
        timeRange,
        totalRuns,
        successfulRuns: successfulRunsCount,
        successRate,
        totalSavings,
      });

      return createSuccessResponse(
        "Dashboard analytics retrieved successfully",
        {
          analytics,
        }
      );
    } catch (error) {
      console.error("Error in dashboard analytics handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);

/**
 * Generate chart data with daily aggregation
 */
function generateChartData(
  runs: Run[],
  days: number,
  averageSavingsPerRun: number
): Array<{
  date: string;
  savings: number;
  dailyAmount: number;
  runCount: number;
}> {
  const chartData: Array<{
    date: string;
    savings: number;
    dailyAmount: number;
    runCount: number;
  }> = [];

  const now = new Date();
  let cumulativeSavings = 0;

  // Create data points for each day in the period
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    // Get runs for this specific day
    const dailyRuns = runs.filter((run) => {
      const runDate = new Date(run.createdAt);
      return runDate >= date && runDate < nextDate;
    });

    const dailySuccessfulRuns = dailyRuns.filter(
      (run) => run.status === "completed"
    );
    const dailyAmount = dailySuccessfulRuns.length * averageSavingsPerRun;
    cumulativeSavings += dailyAmount;

    const isoDate = date.toISOString().split("T")[0];
    chartData.push({
      date: isoDate ?? "", // Ensure type is always string
      savings: cumulativeSavings,
      dailyAmount,
      runCount: dailyRuns.length,
    });
  }

  return chartData;
}

/**
 * Calculate growth percentage between two values
 */
function calculateGrowthPercentage(previous: number, current: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}
