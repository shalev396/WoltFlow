import { type Model, Op, type Attributes, type WhereOptions } from "sequelize";
import RunModel from "../models/Run.js";
import {
  Screenshot as ScreenshotModel,
  User as UserModel,
  Settings,
  WoltSettings,
  RunSettings,
} from "../models/index.js";
import type { DashboardResponseData } from "../routes/user/dashboard.js";
import type { RunsResponseData } from "../routes/user/runs.js";

type RunAttributes = Omit<RunModel, keyof Model | "dataExpiresAt">;

interface ScreenshotData {
  id: string;
  siteUrl: string;
  screenshotUrl: string;
  isError: boolean;
  screenshotType: string;
}

const TIME_RANGE_MAP: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export class Run {
  private _id: RunAttributes["id"];
  private _userId: RunAttributes["userId"];
  private _status: RunAttributes["status"];
  private _stage: RunAttributes["stage"];
  private _amount: RunAttributes["amount"];
  private _errorMessage: RunAttributes["errorMessage"];
  private _createdAt: RunAttributes["createdAt"];
  private _updatedAt: RunAttributes["updatedAt"];
  private _screenshots?: ScreenshotData[];

  constructor(data: RunAttributes) {
    this._id = data.id;
    this._userId = data.userId;
    this._status = data.status;
    this._stage = data.stage;
    this._amount = data.amount;
    this._errorMessage = data.errorMessage;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  // ==================== Getters ====================

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get status(): RunAttributes["status"] {
    return this._status;
  }

  get stage(): RunAttributes["stage"] {
    return this._stage;
  }

  get amount(): number | null {
    return this._amount;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get screenshots(): ScreenshotData[] | undefined {
    return this._screenshots;
  }

  // ==================== Instance Methods ====================

  attachScreenshots(screenshots: ScreenshotData[]): void {
    this._screenshots = screenshots;
  }

  toJSON(): RunAttributes & { screenshots?: ScreenshotData[] } {
    const json: RunAttributes & { screenshots?: ScreenshotData[] } = {
      id: this._id,
      userId: this._userId,
      status: this._status,
      stage: this._stage,
      amount: this._amount,
      errorMessage: this._errorMessage,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };

    if (this._screenshots) {
      json.screenshots = this._screenshots;
    }

    return json;
  }

  // ==================== Static Methods - Query ====================

  static async findById(id: string): Promise<Run | null> {
    const result = await RunModel.findByPk(id);
    if (!result) return null;
    return new Run(result);
  }

  /**
   * Get runs for a user within a date range. Single query, no screenshots.
   */
  static async getForPeriod(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Run[]> {
    const results = await RunModel.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    return results.map((row) => new Run(row));
  }

  /**
   * Get recent runs with screenshots included. Single query with join.
   */
  static async getRecentWithScreenshots(
    userId: string,
    startDate: Date,
    limit: number,
  ): Promise<Run[]> {
    const results = await RunModel.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: new Date(),
        },
      },
      include: [
        {
          model: ScreenshotModel,
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
      limit,
    });

    return results.map((row) => {
      const plain = row.toJSON() as RunAttributes & {
        screenshots?: Array<{
          id: string;
          siteUrl: string | null;
          screenshotUrl: string;
          isError: boolean;
          screenshotType: string;
        }>;
      };
      const run = new Run(plain);

      if (plain.screenshots) {
        run.attachScreenshots(
          plain.screenshots.map((s) => ({
            id: s.id,
            siteUrl: s.siteUrl ?? "",
            screenshotUrl: s.screenshotUrl,
            isError: s.isError,
            screenshotType: s.screenshotType,
          })),
        );
      }

      return run;
    });
  }

  /**
   * Get paginated runs for a user with optional filters and screenshots.
   * Used by the runs list endpoint.
   */
  static async getAllPaginated(
    userId: string,
    options: {
      page: number;
      limit: number;
      status?: string;
      stage?: string;
    },
  ): Promise<RunsResponseData> {
    const { page, limit, status, stage } = options;
    const offset = (page - 1) * limit;

    const whereClause: WhereOptions<Attributes<RunModel>> = {
      userId,
      ...(status ? { status: status as RunModel["status"] } : {}),
      ...(stage ? { stage: stage as RunModel["stage"] } : {}),
    };

    const totalCount = await RunModel.count({ where: whereClause });

    const runs = await RunModel.findAll({
      where: whereClause,
      include: [
        {
          model: ScreenshotModel,
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
      limit,
      offset,
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      runs: runs.map((run) => {
        type RunWithShots = RunModel & {
          screenshots: Array<{
            id: string;
            siteUrl: string | null;
            screenshotUrl: string;
            isError: boolean;
            screenshotType: string;
          }>;
        };
        const r = run as RunWithShots;
        return {
          id: r.id,
          status: r.status,
          stage: r.stage,
          amount: r.amount !== null ? String(r.amount) : null,
          errorMessage: r.errorMessage,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          screenshots: r.screenshots.map((screenshot) => ({
            id: screenshot.id,
            siteUrl: screenshot.siteUrl || "",
            screenshotUrl: screenshot.screenshotUrl,
            isError: screenshot.isError,
            screenshotType: screenshot.screenshotType,
          })),
        };
      }),
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
        status: status || null,
        stage: stage || null,
      },
    };
  }

  // ==================== Static Methods - Dashboard ====================

  /**
   * Build complete dashboard analytics for a user.
   * Optimized to 2 DB queries:
   *   1. All runs in the combined (current + previous) period
   *   2. Recent runs with screenshots
   */
  static async getDashboardData(
    userId: string,
    timeRange: string,
  ): Promise<DashboardResponseData> {
    const days = TIME_RANGE_MAP[timeRange];
    if (!days) {
      throw new Error("Invalid time range. Use 7d, 30d, or 90d");
    }

    const now = new Date();
    const currentPeriodStart = new Date(
      now.getTime() - days * 24 * 60 * 60 * 1000,
    );
    const previousPeriodStart = new Date(
      currentPeriodStart.getTime() - days * 24 * 60 * 60 * 1000,
    );

    const allPeriodRuns = await Run.getForPeriod(
      userId,
      previousPeriodStart,
      now,
    );

    const currentPeriodRuns = allPeriodRuns.filter(
      (run) => run.createdAt >= currentPeriodStart && run.createdAt <= now,
    );
    const previousPeriodRuns = allPeriodRuns.filter(
      (run) =>
        run.createdAt >= previousPeriodStart &&
        run.createdAt < currentPeriodStart,
    );

    const recentRunsLimit = 10;
    const recentRuns = await Run.getRecentWithScreenshots(
      userId,
      currentPeriodStart,
      recentRunsLimit,
    );

    const totalRuns = currentPeriodRuns.length;
    const successfulRuns = currentPeriodRuns.filter(
      (run) => run.status === "completed",
    );
    const failedRunsCount = currentPeriodRuns.filter(
      (run) => run.status === "failed",
    ).length;
    const inProgressRunsCount = currentPeriodRuns.filter(
      (run) => run.status === "in_progress" || run.status === "started",
    ).length;

    const successfulRunsCount = successfulRuns.length;
    const successRate =
      totalRuns > 0
        ? Math.round((successfulRunsCount / totalRuns) * 100)
        : 0;

    const successfulRunAmounts = successfulRuns
      .map((run) => Number(run.amount) || 0)
      .filter((amount) => amount > 0);

    const totalSavings = successfulRunAmounts.reduce(
      (sum, amount) => sum + amount,
      0,
    );
    const averageSavingsPerRun =
      successfulRunAmounts.length > 0
        ? Math.round(totalSavings / successfulRunAmounts.length)
        : 0;

    const lastRun =
      currentPeriodRuns.length > 0 ? currentPeriodRuns[0] : null;
    const daysSinceLastRun = lastRun
      ? Math.floor(
          (now.getTime() - new Date(lastRun.createdAt).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

    const chartData = Run.generateChartData(currentPeriodRuns, days);

    const previousPeriodRunsCount = previousPeriodRuns.length;
    const previousPeriodSavings = previousPeriodRuns
      .filter((run) => run.status === "completed")
      .map((run) => Number(run.amount) || 0)
      .reduce((sum, amount) => sum + amount, 0);

    const runsGrowthPercentage = Run.calculateGrowthPercentage(
      previousPeriodRunsCount,
      totalRuns,
    );
    const savingsGrowthPercentage = Run.calculateGrowthPercentage(
      previousPeriodSavings,
      totalSavings,
    );

    return {
      analytics: {
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
        recentRuns: recentRuns.map((run) => ({
          id: run.id,
          status: run.status,
          stage: run.stage,
          amount: run.amount !== null ? String(run.amount) : null,
          errorMessage: run.errorMessage,
          createdAt: run.createdAt,
          updatedAt: run.updatedAt,
          screenshots: (run.screenshots ?? []).map((screenshot) => ({
            id: screenshot.id,
            siteUrl: screenshot.siteUrl,
            screenshotUrl: screenshot.screenshotUrl,
            isError: screenshot.isError,
            screenshotType: screenshot.screenshotType,
          })),
        })),
        trendComparison: {
          previousPeriodRuns: previousPeriodRunsCount,
          previousPeriodSavings,
          runsGrowthPercentage,
          savingsGrowthPercentage,
        },
      },
    };
  }

  // ==================== Private Static Helpers ====================

  private static generateChartData(
    runs: Run[],
    days: number,
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

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dailyRuns = runs.filter((run) => {
        const runDate = new Date(run.createdAt);
        return runDate >= date && runDate < nextDate;
      });

      const dailySuccessfulRuns = dailyRuns.filter(
        (run) => run.status === "completed",
      );
      const dailyAmount = dailySuccessfulRuns
        .map((run) => Number(run.amount) || 0)
        .reduce((sum, amount) => sum + amount, 0);
      cumulativeSavings += dailyAmount;

      const isoDate = date.toISOString().split("T")[0];
      chartData.push({
        date: isoDate ?? "",
        savings: cumulativeSavings,
        dailyAmount,
        runCount: dailyRuns.length,
      });
    }

    return chartData;
  }

  private static calculateGrowthPercentage(
    previous: number,
    current: number,
  ): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
  }

  // ==================== Static Methods - Automation ====================

  static async createForAutomation(
    userId: string,
    amount: number | null,
  ): Promise<Run> {
    const record = await RunModel.create({
      userId,
      status: "started",
      stage: "triggered",
      amount,
      errorMessage: null,
    });
    return new Run(record);
  }

  static async createFailed(
    userId: string,
    errorMessage: string,
  ): Promise<Run> {
    const record = await RunModel.create({
      userId,
      status: "failed",
      stage: "triggered",
      amount: null,
      errorMessage,
    });
    return new Run(record);
  }

  static async updateStage(
    runId: string,
    stage: RunModel["stage"],
  ): Promise<void> {
    await RunModel.update({ stage }, { where: { id: runId } });
  }

  static async markFailed(
    runId: string,
    errorMessage?: string,
  ): Promise<void> {
    const updates: { status: string; errorMessage?: string } = {
      status: "failed",
    };
    if (errorMessage !== undefined) {
      updates.errorMessage = errorMessage;
    }
    await RunModel.update(updates, { where: { id: runId } });
  }

  static async markCompleted(runId: string): Promise<void> {
    await RunModel.update(
      { status: "completed", stage: "completed" },
      { where: { id: runId } },
    );
  }

  static async updateStatusAndStage(
    runId: string,
    status: RunModel["status"],
    stage: RunModel["stage"],
  ): Promise<void> {
    await RunModel.update({ status, stage }, { where: { id: runId } });
  }

  static async findLatestForUser(userId: string): Promise<Run | null> {
    const result = await RunModel.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    if (!result) return null;
    return new Run(result);
  }

  static async findWithWoltSettings(
    runId: string,
  ): Promise<AutomationRunWithWoltSettings | null> {
    const result = await RunModel.findByPk(runId, {
      include: [
        {
          model: UserModel,
          as: "user",
          include: [
            {
              model: Settings,
              as: "settings",
              include: [
                {
                  model: WoltSettings,
                  as: "woltSettings",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!result) return null;

    type Nested = RunModel & {
      user?: UserModel & {
        settings?: Settings & {
          woltSettings?: WoltSettings;
        };
      };
    };
    const nested = result as Nested;
    const woltSettings = nested.user?.settings?.woltSettings;

    return {
      runId: result.id,
      userId: result.userId,
      hasWoltSettings: !!woltSettings,
      woltRefreshToken: woltSettings?.woltRefreshToken ?? null,
      woltAccessToken: woltSettings?.woltAccessToken ?? null,
    };
  }

  static async findWithAllSettings(
    runId: string,
  ): Promise<AutomationRunWithAllSettings | null> {
    const result = await RunModel.findByPk(runId, {
      include: [
        {
          model: UserModel,
          as: "user",
          include: [
            {
              model: Settings,
              as: "settings",
              include: [
                {
                  model: WoltSettings,
                  as: "woltSettings",
                },
                {
                  model: RunSettings,
                  as: "runSettings",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!result) return null;

    type Nested = RunModel & {
      user?: UserModel & {
        settings?: Settings & {
          woltSettings?: WoltSettings;
          runSettings?: RunSettings;
        };
      };
    };
    const nested = result as Nested;
    const woltSettings = nested.user?.settings?.woltSettings;
    const runSettings = nested.user?.settings?.runSettings;

    return {
      runId: result.id,
      userId: result.userId,
      hasAllSettings: !!(woltSettings && runSettings),
      woltRefreshToken: woltSettings?.woltRefreshToken ?? null,
      woltAccessToken: woltSettings?.woltAccessToken ?? null,
      giftAmount: Number(runSettings?.giftAmount) || 0,
    };
  }

  // ==================== Static Methods - Notification ====================

  static async findWithScreenshots(
    runId: string,
  ): Promise<RunForNotification | null> {
    const result = await RunModel.findByPk(runId, {
      include: [
        {
          model: ScreenshotModel,
          attributes: ["screenshotUrl", "isError"],
          as: "screenshots",
        },
      ],
    });

    if (!result) return null;

    type RunWithShots = RunModel & {
      screenshots?: ScreenshotModel[];
    };
    const nested = result as RunWithShots;
    const screenshots = (nested.screenshots || []).map((s) => ({
      screenshotUrl: s.screenshotUrl,
      isError: s.isError,
    }));

    return {
      id: result.id,
      status: result.status,
      stage: result.stage,
      amount: result.amount,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      screenshots,
    };
  }

  static async saveScreenshot(
    runId: string,
    screenshotUrl: string,
    isError: boolean,
    siteUrl?: string,
    screenshotType: "error" | "success" | "step" | "debug" | "final" = "step",
    stage?: string,
  ): Promise<ScreenshotModel> {
    return await ScreenshotModel.create({
      runId,
      screenshotUrl,
      siteUrl,
      screenshotType,
      stage,
      isError,
    });
  }
}

// ==================== Automation Interfaces ====================

export interface AutomationRunWithWoltSettings {
  runId: string;
  userId: string;
  hasWoltSettings: boolean;
  woltRefreshToken: string | null;
  woltAccessToken: string | null;
}

export interface AutomationRunWithAllSettings {
  runId: string;
  userId: string;
  hasAllSettings: boolean;
  woltRefreshToken: string | null;
  woltAccessToken: string | null;
  giftAmount: number;
}

// ==================== Notification Interfaces ====================

export interface RunForNotification {
  id: string;
  status: string;
  stage: string;
  amount: number | null;
  createdAt: Date;
  updatedAt: Date;
  screenshots: ScreenshotForNotification[];
}

export interface ScreenshotForNotification {
  screenshotUrl: string;
  isError: boolean;
}
