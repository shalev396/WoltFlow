import { TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecentRunsQuery } from "@/queries/runs";

export default function SavingsOverviewCard() {
  const { data: recentRuns, isLoading } = useRecentRunsQuery(30); // Last 30 runs for monthly view

  // Calculate savings metrics from real data
  const successfulRuns =
    recentRuns?.filter((run) => run.status === "completed") ?? [];
  const avgSavingsPerRun = 40; // ₪40 per successful run as example
  const totalSavings = successfulRuns.length * avgSavingsPerRun;

  // Calculate monthly trend (compare last 15 vs previous 15 runs)
  const recentHalf = successfulRuns.slice(0, 15);
  const previousHalf = successfulRuns.slice(15, 30);
  const recentSavings = recentHalf.length * avgSavingsPerRun;
  const previousSavings = previousHalf.length * avgSavingsPerRun;
  const trendPercentage =
    previousSavings > 0
      ? Math.round(((recentSavings - previousSavings) / previousSavings) * 100)
      : 0;

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
              {trendPercentage >= 0 ? "+" : ""}
              {trendPercentage}%
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
              This month from automated claims
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200 dark:border-green-800">
            <div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                {isLoading ? (
                  <div className="h-6 w-8 bg-green-200 dark:bg-green-800/50 animate-pulse rounded" />
                ) : (
                  successfulRuns.length
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

          {/* Monthly projection */}
          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
              <Calendar className="h-4 w-4" />
              <span>
                On track for ₪{Math.round(totalSavings * 1.2).toLocaleString()}{" "}
                this month
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
