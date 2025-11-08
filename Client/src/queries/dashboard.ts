import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";
import type { DashboardAnalytics, TimeRange } from "@/types/api";

export const DASHBOARD_QUERY_KEY = ["dashboard"] as const;

/**
 * Get dashboard analytics for the authenticated user
 */
export function useDashboardAnalyticsQuery(
  timeRange: TimeRange = "30d",
  options?: {
    refetchInterval?: number;
    staleTime?: number;
    enabled?: boolean;
  }
) {
  return useQuery<DashboardAnalytics, Error>({
    queryKey: [...DASHBOARD_QUERY_KEY, timeRange],
    queryFn: () => dashboardService.getDashboardAnalytics(timeRange),
    staleTime: options?.staleTime || 2 * 60 * 1000, // 2 minutes default
    refetchInterval: options?.refetchInterval || 5 * 60 * 1000, // Auto-refresh every 5 minutes
    enabled: options?.enabled !== false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
