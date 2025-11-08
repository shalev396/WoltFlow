import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { runsService } from "@/services/runs";
import type { RunFilters, RunsResponse, RunWithScreenshots } from "@/types";

export const RUNS_QUERY_KEY = ["runs"] as const;

// Single optimized runs query - handles all use cases
export function useRunsQuery(
  page: number = 1,
  limit: number = 10,
  filters?: RunFilters,
  options?: {
    refetchInterval?: number;
    staleTime?: number;
  }
) {
  return useQuery({
    queryKey: [...RUNS_QUERY_KEY, page, limit, filters],
    queryFn: () => runsService.getRuns(page, limit, filters),
    staleTime: options?.staleTime || 5 * 60 * 1000, // Default 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination without loading states
    refetchInterval: options?.refetchInterval,
  });
}

// Optimized hooks for specific use cases using the same base query
export function useRecentRunsQuery(limit: number = 5) {
  return useQuery({
    queryKey: [...RUNS_QUERY_KEY, 1, limit, {}],
    queryFn: () => runsService.getRuns(1, limit, {}),
    staleTime: 5 * 60 * 1000, // 2 minutes for recent runs
    refetchInterval: 30 * 1000, // Auto-refresh every 30s when focused
    select: (data: RunsResponse): RunWithScreenshots[] => data.runs, // Return only runs array for recent activity
  });
}
