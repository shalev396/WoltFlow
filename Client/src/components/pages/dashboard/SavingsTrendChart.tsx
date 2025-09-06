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
    color: "hsl(var(--chart-1))",
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
  const successfulDays = rawChartData.filter((d) => d.dailyAmount > 0).length;

  // Filter out leading zero data points to make chart more readable
  const firstNonZeroIndex = rawChartData.findIndex(
    (d) => d.savings > 0 || d.dailyAmount > 0
  );
  const chartData =
    firstNonZeroIndex >= 0
      ? rawChartData.slice(firstNonZeroIndex)
      : rawChartData;

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
            <TrendingUp className="h-5 w-5 text-chart-1" />
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
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.1}
                    />
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
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value: string) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                      indicator="dot"
                      formatter={(value: number) => [
                        `₪${value.toLocaleString()}`,
                        "Cumulative Savings",
                      ]}
                    />
                  }
                />
                <Area
                  dataKey="savings"
                  type="natural"
                  fill="url(#fillSavings)"
                  stroke="hsl(var(--chart-1))"
                />
              </AreaChart>
            </ChartContainer>

            {/* Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t">
              <span>Total accumulated: ₪{totalSavings.toLocaleString()}</span>
              <span>{successfulDays} successful days</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
