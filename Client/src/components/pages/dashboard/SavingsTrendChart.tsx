"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import type { DashboardAnalytics, TimeRange } from "@/types/api";

const chartConfig = {
  savings: {
    label: "Cumulative Savings",
    color: "#2563eb", // WoltFlow brand blue-600
  },
} satisfies ChartConfig;

interface SavingsTrendChartProps {
  analytics?: DashboardAnalytics;
  isLoading: boolean;
  timeRange: TimeRange;
}

export default function SavingsTrendChart({
  analytics,
  isLoading,
  timeRange,
}: SavingsTrendChartProps) {
  const rawChartData = analytics?.chartData || [];
  const totalSavings = analytics?.totalSavings || 0;

  // The API (both real and mock) now provides properly filtered data for the selected time range
  // We need to recalculate cumulative savings starting from 0 for the chart visualization
  const chartData = rawChartData.map((item, index) => {
    // Calculate cumulative savings starting from 0 for this time period
    const relativeCumulativeSavings = rawChartData
      .slice(0, index + 1)
      .reduce((sum, dayData) => sum + dayData.dailyAmount, 0);

    return {
      ...item,
      savings: relativeCumulativeSavings, // Override with relative cumulative savings for chart
    };
  });

  // Use the API-provided totalSavings for summary (now correctly filtered by time range)
  const totalDaysInRange = chartData.length;
  const averageDailySavings =
    totalDaysInRange > 0 ? totalSavings / totalDaysInRange : 0;

  const getTimeRangeLabel = (range: TimeRange) => {
    switch (range) {
      case "7d":
        return "Last 7 days";
      case "90d":
        return "Last 3 months";
      default:
        return "Last 30 days";
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Savings Trend</span>
          </CardTitle>
          <CardDescription>
            Showing cumulative savings over{" "}
            {getTimeRangeLabel(timeRange).toLowerCase()}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        ) : !chartData || chartData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No savings data available yet</p>
              <p className="text-sm">
                Complete your first automated run to see trends
              </p>
            </div>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[250px] pt-4">
              <AreaChart
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 16,
                  bottom: 8,
                }}
              >
                <defs>
                  <linearGradient id="fillSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="50%" stopColor="#7c3aed" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Area
                  dataKey="savings"
                  type="natural"
                  fill="url(#fillSavings)"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>

            {/* Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t">
              <span>
                Average daily savings: ₪{averageDailySavings.toFixed(2)}
              </span>
              <span>
                Over {totalDaysInRange} days (
                {getTimeRangeLabel(timeRange).toLowerCase()})
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
