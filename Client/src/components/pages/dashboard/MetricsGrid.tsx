import { TrendingUp, Calendar, CheckCircle, Clock } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import type { DashboardAnalytics } from "@/types/api";

interface MetricsGridProps {
  analytics?: DashboardAnalytics;
  isLoading: boolean;
}

export default function MetricsGrid({
  analytics,
  isLoading,
}: MetricsGridProps) {
  // Use analytics data if available, fallback to 0
  const totalRuns = analytics?.totalRuns ?? 0;
  const successfulRuns = analytics?.successfulRuns ?? 0;
  const successRate = analytics?.successRate ?? 0;
  const totalSavings = analytics?.totalSavings ?? 0;
  const daysSinceLastRun = analytics?.daysSinceLastRun;
  const savingsGrowth = analytics?.trendComparison.savingsGrowthPercentage ?? 0;
  const runsGrowth = analytics?.trendComparison.runsGrowthPercentage ?? 0;

  const getTimeRangeDescription = (timeRange?: string) => {
    switch (timeRange) {
      case "7d":
        return "Last 7 days";
      case "90d":
        return "Last 90 days";
      default:
        return "Last 30 days";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Savings"
        value={`₪${totalSavings.toLocaleString()}`}
        description={getTimeRangeDescription(analytics?.timeRange)}
        icon={TrendingUp}
        trend={{
          value: Math.abs(savingsGrowth),
          isPositive: savingsGrowth >= 0,
          label: "vs previous period",
        }}
        isLoading={isLoading}
        variant="success"
      />

      <StatCard
        title="Success Rate"
        value={`${successRate}%`}
        description={`${successfulRuns} successful runs`}
        icon={CheckCircle}
        trend={{
          value: Math.abs(runsGrowth),
          isPositive: runsGrowth >= 0,
          label: "vs previous period",
        }}
        isLoading={isLoading}
        variant="default"
      />

      <StatCard
        title="Total Runs"
        value={totalRuns.toString()}
        description={getTimeRangeDescription(analytics?.timeRange)}
        icon={Calendar}
        isLoading={isLoading}
        variant="default"
      />

      <StatCard
        title="Last Run"
        value={
          daysSinceLastRun !== null && daysSinceLastRun !== undefined
            ? daysSinceLastRun === 0
              ? "Today"
              : `${daysSinceLastRun}d ago`
            : "Never"
        }
        description="Days since last execution"
        icon={Clock}
        isLoading={isLoading}
        variant="default"
      />
    </div>
  );
}
