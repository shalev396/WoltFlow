import { useQuery } from "@tanstack/react-query";
import { inboxService } from "@/services/inbox";
import type { InboxResponseData, InboxFilters } from "@/types";

export function useInboxQuery(
  filters?: InboxFilters,
  options?: {
    refetchInterval?: number;
    staleTime?: number;
    enabled?: boolean;
  },
) {
  return useQuery<InboxResponseData, Error>({
    queryKey: ["inbox", filters],
    queryFn: () => inboxService.getInbox(filters),
    staleTime: options?.staleTime || 30000,
    refetchInterval: options?.refetchInterval || 60000,
    enabled: options?.enabled !== false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useEmailsByDateQuery(
  startDate?: string,
  endDate?: string,
  options?: {
    refetchInterval?: number;
    enabled?: boolean;
  },
) {
  const filters = startDate || endDate ? { startDate, endDate } : undefined;

  return useInboxQuery(filters, {
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
    staleTime: 30000,
  });
}

export function usePaginatedInboxQuery(
  page: number = 1,
  limit: number = 20,
  additionalFilters?: Omit<InboxFilters, "page" | "limit">,
) {
  const filters: InboxFilters = {
    page,
    limit,
    ...additionalFilters,
  };

  return useInboxQuery(filters, {
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useRecentEmailsQuery() {
  return useInboxQuery(
    { limit: 10, page: 1 },
    {
      staleTime: 30000,
      refetchInterval: 120000,
    },
  );
}

export function useActiveInboxQuery() {
  return useInboxQuery(
    { limit: 50, page: 1 },
    {
      staleTime: 10000,
      refetchInterval: 30000,
    },
  );
}
