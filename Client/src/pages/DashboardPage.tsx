import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import Layout from "@/components/shared/Layout";
import SavingsOverviewCard from "@/components/pages/dashboard/SavingsOverviewCard";
import SavingsTrendChart from "@/components/pages/dashboard/SavingsTrendChart";
import LastRunsTable from "@/components/pages/dashboard/LastRunsTable";
import MetricsGrid from "@/components/pages/dashboard/MetricsGrid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { useDashboardAnalyticsQuery } from "@/queries/dashboard";
import type { TimeRange } from "@/types/api";

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const {
    data: analytics,
    isLoading,
    error,
  } = useDashboardAnalyticsQuery(timeRange);

  const timeRangeLabels: Record<TimeRange, string> = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
  };

  if (error) {
    return (
      <Layout
        title="Dashboard"
        description={user?.name ? `Welcome back, ${user.name}` : undefined}
      >
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              Failed to load dashboard data. Please refresh the page.
            </p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout
      title="Dashboard"
      description={user?.name ? `Welcome back, ${user.name}` : undefined}
    >
      {/* Time Range Selector */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5" />
              Analytics Period
            </CardTitle>
            <Select
              value={timeRange}
              onValueChange={(value: TimeRange) => setTimeRange(value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm">
            Showing analytics data for{" "}
            {timeRangeLabels[timeRange].toLowerCase()}
          </p>
        </CardContent>
      </Card>

      {/* Metrics grid */}
      <MetricsGrid analytics={analytics} isLoading={isLoading} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column - Savings overview and chart */}
        <div className="xl:col-span-2 space-y-6">
          <SavingsOverviewCard analytics={analytics} isLoading={isLoading} />
          <SavingsTrendChart
            analytics={analytics}
            isLoading={isLoading}
            timeRange={timeRange}
          />
        </div>

        {/* Right column - Recent runs */}
        <div className="xl:col-span-1">
          <LastRunsTable analytics={analytics} isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  );
}
