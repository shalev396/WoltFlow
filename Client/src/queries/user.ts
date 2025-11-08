import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { userService } from "@/services/user";
import { type AppDispatch } from "@/store/store";
import { logoutSuccess } from "@/store/slices/userSlice";

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
 * Hook for deleting user account
 * Automatically logs out the user and clears all data after successful deletion
 */
export function useDeleteUserAccountMutation() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: () => userService.deleteUserAccount(),
    onSuccess: () => {
      // Clear all cached data when account is deleted
      queryClient.clear();

      // Log out the user immediately after successful account deletion
      dispatch(logoutSuccess());

      // Optionally redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    },
    retry: 1,
  });
}
