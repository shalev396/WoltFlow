import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { runsService } from "@/services/runs";
import type { RunFilters, RunsResponseData } from "@/types";

export const RUNS_QUERY_KEY = ["runs"] as const;

export function useRunsQuery(
  page: number = 1,
  limit: number = 10,
  filters?: RunFilters,
  options?: {
    refetchInterval?: number;
    staleTime?: number;
  },
) {
  return useQuery({
    queryKey: [...RUNS_QUERY_KEY, page, limit, filters],
    queryFn: () => runsService.getRuns(page, limit, filters),
    staleTime: options?.staleTime || 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchInterval: options?.refetchInterval,
  });
}

export function useRecentRunsQuery(limit: number = 5) {
  return useQuery({
    queryKey: [...RUNS_QUERY_KEY, 1, limit, {}],
    queryFn: () => runsService.getRuns(1, limit, {}),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
    select: (data: RunsResponseData) => data.runs,
  });
}
