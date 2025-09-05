// ============================================================================
// API RESPONSE TYPES
// ============================================================================
// Core types for API communication

import type { RunWithScreenshots } from "./runs";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
}

// ============================================================================
// DASHBOARD ANALYTICS TYPES
// ============================================================================
export interface DashboardAnalytics {
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

export type TimeRange = "7d" | "30d" | "90d";

export interface DashboardResponse {
  analytics: DashboardAnalytics;
}
