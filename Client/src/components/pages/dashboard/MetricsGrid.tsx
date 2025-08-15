import { TrendingUp, Calendar, CheckCircle, Clock } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { useRecentRunsQuery } from "@/queries/runs";

export default function MetricsGrid() {
  const { data: recentRuns, isLoading } = useRecentRunsQuery(10);

  // Calculate metrics from real data
  const totalRuns = recentRuns?.length ?? 0;
  const successfulRuns =
    recentRuns?.filter((run) => run.status === "completed").length ?? 0;
  const successRate =
    totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 0;

  // Calculate estimated monthly savings (₪40 per successful run as example)
  const avgSavingsPerRun = 40;
  const estimatedMonthlySavings = successfulRuns * avgSavingsPerRun;

  // Calculate days since last run
  const lastRun = recentRuns?.[0];
  const daysSinceLastRun = lastRun
    ? Math.floor(
        (Date.now() - new Date(lastRun.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Monthly Savings"
        value={`₪${estimatedMonthlySavings.toLocaleString()}`}
        description="Estimated this month"
        icon={TrendingUp}
        trend={{ value: 12, isPositive: true, label: "vs last month" }}
        isLoading={isLoading}
        variant="success"
      />

      <StatCard
        title="Success Rate"
        value={`${successRate}%`}
        description="Last 10 runs"
        icon={CheckCircle}
        trend={{ value: 2.1, isPositive: true, label: "improvement" }}
        isLoading={isLoading}
        variant="default"
      />

      <StatCard
        title="Total Runs"
        value={totalRuns.toString()}
        description="This month"
        icon={Calendar}
        isLoading={isLoading}
        variant="default"
      />

      <StatCard
        title="Last Run"
        value={daysSinceLastRun !== null ? `${daysSinceLastRun}d ago` : "Never"}
        description="Days since last execution"
        icon={Clock}
        isLoading={isLoading}
        variant="default"
      />
    </div>
  );
}
