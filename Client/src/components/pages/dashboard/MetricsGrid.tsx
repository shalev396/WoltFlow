import { TrendingUp, Calendar, CheckCircle, CalendarDays } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DashboardAnalytics, TimeRange } from "@/types/api";

interface MetricsGridProps {
  analytics?: DashboardAnalytics;
  isLoading: boolean;
  timeRange?: TimeRange;
  onTimeRangeChange?: (timeRange: TimeRange) => void;
}

export default function MetricsGrid({
  analytics,
  isLoading,
  timeRange = "30d",
  onTimeRangeChange,
}: MetricsGridProps) {
  // Use analytics data if available, fallback to 0
  const totalRuns = analytics?.totalRuns ?? 0;
  const successfulRuns = analytics?.successfulRuns ?? 0;
  const successRate = analytics?.successRate ?? 0;
  const totalSavings = analytics?.totalSavings ?? 0;
  const savingsGrowth =
    analytics?.trendComparison?.savingsGrowthPercentage ?? 0;
  const runsGrowth = analytics?.trendComparison?.runsGrowthPercentage ?? 0;

  const getTimeRangeDescription = (range: TimeRange) => {
    switch (range) {
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
        description={getTimeRangeDescription(timeRange)}
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
        description={getTimeRangeDescription(timeRange)}
        icon={Calendar}
        isLoading={isLoading}
        variant="default"
      />

      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Analytics Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            </div>
          ) : (
            <div className="space-y-3">
              <Select
                value={timeRange}
                onValueChange={(value: TimeRange) => onTimeRangeChange?.(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {getTimeRangeDescription(timeRange)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
