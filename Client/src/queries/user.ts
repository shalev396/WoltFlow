import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { type ExportResponse } from "@/types/export";

// Query keys
export const userKeys = {
  all: ["user"] as const,
  export: () => [...userKeys.all, "export"] as const,
};

/**
 * Hook for exporting user data with extended caching
 * Uses 5-minute stale time to allow quick re-exports without re-fetching
 */
export function useExportUserDataQuery(options?: {
  enabled?: boolean;
  onSuccess?: (data: ExportResponse) => void;
  onError?: (error: Error) => void;
}) {
  return useQuery({
    queryKey: userKeys.export(),
    queryFn: () => userService.exportUserData(),
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== false,
    ...options,
  });
}

/**
 * Mutation for triggering user data export
 * This is useful when you want to manually trigger the export and handle loading states
 */
export function useExportUserDataMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.exportUserData(),
    onSuccess: (data) => {
      // Cache the export data for 5 minutes
      queryClient.setQueryData(userKeys.export(), data);
    },
    retry: 1,
  });
}

/**
 * Hook for deleting user account (placeholder for now)
 */
export function useDeleteUserAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.deleteUserAccount(),
    onSuccess: () => {
      // Clear all cached data when account is deleted
      queryClient.clear();
    },
    retry: 1,
  });
}

/**
 * Prefetch user export data
 */
export function usePrefetchUserExport() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: userKeys.export(),
      queryFn: () => userService.exportUserData(),
      staleTime: 5 * 60 * 1000,
    });
  };
}
