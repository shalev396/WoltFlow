import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";
import type { TimeRange } from "@/types";

export const DASHBOARD_QUERY_KEY = ["dashboard"] as const;

export function useDashboardAnalyticsQuery(
  timeRange: TimeRange = "30d",
  options?: {
    refetchInterval?: number;
    staleTime?: number;
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, timeRange],
    queryFn: () => dashboardService.getDashboardAnalytics(timeRange),
    staleTime: options?.staleTime || 2 * 60 * 1000,
    refetchInterval: options?.refetchInterval || 5 * 60 * 1000,
    enabled: options?.enabled !== false,
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
