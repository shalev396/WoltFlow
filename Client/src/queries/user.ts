import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user";

// Query keys
export const userKeys = {
  all: ["user"] as const,
  export: () => [...userKeys.all, "export"] as const,
};

/**
 * Mutation for triggering user data export ZIP download
 * This automatically downloads the ZIP file when executed
 */
export function useExportUserDataMutation() {
  return useMutation({
    mutationFn: () => userService.exportUserData(),
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
