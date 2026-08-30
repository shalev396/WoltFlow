import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { runsService } from "@/services/runs";
import type {
  RunFilters,
  RunsResponseData,
  ManualRunStatusResponseData,
} from "@/types";
import { getApiErrorMessage } from "@/utils/errorUtils";

export const RUNS_QUERY_KEY = ["runs"] as const;
export const MANUAL_RUN_STATUS_KEY = ["runs", "manual-status"] as const;

const ONE_HOUR_MS = 60 * 60 * 1000;
const THIRTY_SECONDS_MS = 30 * 1000;

function manualRunStaleTime(data: ManualRunStatusResponseData | undefined) {
  if (!data) return THIRTY_SECONDS_MS;
  if (!data.featureEnabled) return ONE_HOUR_MS;
  if (data.issues.length > 0) return THIRTY_SECONDS_MS;
  return ONE_HOUR_MS;
}

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

export function useManualRunStatusQuery() {
  return useQuery({
    queryKey: MANUAL_RUN_STATUS_KEY,
    queryFn: runsService.getManualRunStatus,
    staleTime: (query) => manualRunStaleTime(query.state.data),
    gcTime: ONE_HOUR_MS,
  });
}

export function useTriggerManualRunMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runsService.triggerManualRun,
    onSuccess: () => {
      const endsAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      queryClient.setQueryData<ManualRunStatusResponseData>(
        MANUAL_RUN_STATUS_KEY,
        (prev) =>
          prev
            ? {
                ...prev,
                eligible: false,
                issues: [
                  ...prev.issues.filter((i) => i.code !== "cooldown_active"),
                  { code: "cooldown_active" },
                ],
                cooldown: {
                  active: true,
                  retryAfterSeconds: 5 * 60,
                  endsAt,
                },
              }
            : prev,
      );
      void queryClient.invalidateQueries({ queryKey: RUNS_QUERY_KEY });
      toast.success("Automation started", {
        description: "Your run has been queued and will appear below shortly.",
      });
    },
    onError: (error) => {
      void queryClient.invalidateQueries({ queryKey: MANUAL_RUN_STATUS_KEY });
      toast.error("Could not start run", {
        description: getApiErrorMessage(error, "Please try again later"),
      });
    },
  });
}
