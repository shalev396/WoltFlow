"use client";

import { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import { useRecentRunsQuery } from "@/queries/runs";

const chartConfig = {
  savings: {
    label: "Savings",
    color: "hsl(var(--chart-1))",
  },
  dailyAmount: {
    label: "Daily Amount",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function SavingsTrendChart() {
  const [timeRange, setTimeRange] = useState("30d");
  const { data: recentRuns, isLoading } = useRecentRunsQuery(90); // Get more data for filtering

  // Transform run data into chart data
  const chartData = useMemo(() => {
    if (!recentRuns) return [];

    // Group runs by day and calculate daily and cumulative savings
    const runsWithDates = recentRuns
      .filter((run) => run.status === "completed")
      .map((run) => ({
        ...run,
        date: new Date(run.createdAt).toISOString().split("T")[0], // Format as YYYY-MM-DD
      }));

    const dailySavingsMap = runsWithDates.reduce((acc, run) => {
      acc[run.date] = (acc[run.date] || 0) + 40; // ₪40 per successful run
      return acc;
    }, {} as Record<string, number>);

    // Determine date range based on selection
    const today = new Date();
    let daysToShow = 30;
    if (timeRange === "7d") daysToShow = 7;
    else if (timeRange === "90d") daysToShow = 90;

    // Create data points for the selected period
    const data = [];
    let cumulative = 0;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      const dailyAmount = dailySavingsMap[dateKey] || 0;
      cumulative += dailyAmount;

      data.push({
        date: dateKey,
        savings: cumulative,
        dailyAmount,
      });
    }

    return data;
  }, [recentRuns, timeRange]);

  const totalSavings = chartData[chartData.length - 1]?.savings || 0;
  const successfulDays = chartData.filter((d) => d.dailyAmount > 0).length;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-chart-1" />
            <span>Savings Trend</span>
          </CardTitle>
          <CardDescription>
            Showing cumulative savings over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        ) : chartData.length === 0 ? (
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
                      stopColor="var(--color-savings)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-savings)"
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
                      formatter={(value: number, name: string) => [
                        `₪${value.toLocaleString()}`,
                        name === "savings" ? "Total Savings" : "Daily Amount",
                      ]}
                    />
                  }
                />
                <Area
                  dataKey="savings"
                  type="natural"
                  fill="url(#fillSavings)"
                  stroke="var(--color-savings)"
                  strokeWidth={2}
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
