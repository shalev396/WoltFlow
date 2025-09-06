import { TrendingUp, DollarSign, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardAnalytics } from "@/types/api";

interface SavingsOverviewCardProps {
  analytics?: DashboardAnalytics;
  isLoading: boolean;
}

export default function SavingsOverviewCard({
  analytics,
  isLoading,
}: SavingsOverviewCardProps) {
  // Use analytics data
  const totalSavings = analytics?.totalSavings ?? 0;
  const successfulRuns = analytics?.successfulRuns ?? 0;
  const avgSavingsPerRun = analytics?.averageSavingsPerRun ?? 40;
  const savingsGrowthPercentage =
    analytics?.trendComparison?.savingsGrowthPercentage ?? 0;

  const getTimeRangeLabel = (timeRange?: string) => {
    switch (timeRange) {
      case "7d":
        return "this week";
      case "90d":
        return "last 3 months";
      default:
        return "this month";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200">
              Total Savings
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
            <TrendingUp className="h-4 w-4" />
            <span>
              {savingsGrowthPercentage >= 0 ? "+" : ""}
              {savingsGrowthPercentage}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main savings amount */}
          <div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              {isLoading ? (
                <div className="h-12 w-32 bg-green-200 dark:bg-green-800/50 animate-pulse rounded" />
              ) : (
                `₪${totalSavings.toLocaleString()}`
              )}
            </div>
            <p className="text-green-700 dark:text-green-300 text-sm">
              Saved {getTimeRangeLabel(analytics?.timeRange)} from automated
              claims
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200 dark:border-green-800">
            <div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                {isLoading ? (
                  <div className="h-6 w-8 bg-green-200 dark:bg-green-800/50 animate-pulse rounded" />
                ) : (
                  successfulRuns
                )}
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Successful claims
              </p>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                ₪{avgSavingsPerRun}
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Average per claim
              </p>
            </div>
          </div>

          {/* Growth indicator */}
          {analytics && analytics.timeRange !== "90d" && (
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                <Target className="h-4 w-4" />
                <span>
                  {savingsGrowthPercentage >= 0
                    ? `Growing ${savingsGrowthPercentage}% vs previous period`
                    : `Down ${Math.abs(
                        savingsGrowthPercentage
                      )}% vs previous period`}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
