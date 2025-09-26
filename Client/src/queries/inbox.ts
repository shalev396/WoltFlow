import { useQuery } from "@tanstack/react-query";
import { inboxService } from "@/services/inbox";
import type { InboxFilters, InboxResponse } from "@/types/index";

/**
 * Get user's inbox and emails with optional filters
 */
export function useInboxQuery(
  filters?: InboxFilters,
  options?: {
    refetchInterval?: number;
    staleTime?: number;
    enabled?: boolean;
  }
) {
  return useQuery<InboxResponse, Error>({
    queryKey: ["inbox", filters],
    queryFn: () => inboxService.getInbox(filters),
    staleTime: options?.staleTime || 30000, // 30 seconds
    refetchInterval: options?.refetchInterval || 60000, // Refetch every minute
    enabled: options?.enabled !== false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Get emails with date range filter
 */
export function useEmailsByDateQuery(
  startDate?: string,
  endDate?: string,
  options?: {
    refetchInterval?: number;
    enabled?: boolean;
  }
) {
  const filters = startDate || endDate ? { startDate, endDate } : undefined;

  return useInboxQuery(filters, {
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
    staleTime: 30000,
  });
}

/**
 * Get paginated emails
 */
export function usePaginatedInboxQuery(
  page: number = 1,
  limit: number = 20,
  additionalFilters?: Omit<InboxFilters, "page" | "limit">
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

/**
 * Get recent emails (first 10)
 */
export function useRecentEmailsQuery() {
  return useInboxQuery(
    { limit: 10, page: 1 },
    {
      staleTime: 30000,
      refetchInterval: 120000, // Refetch every 2 minutes
    }
  );
}

/**
 * Get recent emails with higher refresh rate
 */
export function useActiveInboxQuery() {
  return useInboxQuery(
    { limit: 50, page: 1 },
    {
      staleTime: 10000, // Consider data stale after 10 seconds
      refetchInterval: 30000, // Refetch every 30 seconds for active use
    }
  );
}
