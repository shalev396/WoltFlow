import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsService } from "@/services/settings";
import type { UserSettings, UserSettingsUpdate } from "@/types";

export const SETTINGS_QUERY_KEY = ["settings"] as const;

export function useSettingsQuery() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: settingsService.getSettings,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsService.updateSettings,
    onMutate: async (newSettings: UserSettingsUpdate) => {
      // Cancel any outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY });

      // Snapshot the previous value for potential rollback
      const previousSettings =
        queryClient.getQueryData<UserSettings>(SETTINGS_QUERY_KEY);

      // Optimistically update the cache immediately without refetching
      if (previousSettings) {
        queryClient.setQueryData<UserSettings>(SETTINGS_QUERY_KEY, {
          ...previousSettings,
          ...newSettings,
          updatedAt: new Date(),
        });
      }

      // Return context with snapshot for rollback in onError
      return { previousSettings };
    },
    onError: (error, newSettings, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSettings) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previousSettings);
      }

      toast.error("Failed to update settings", {
        description: "Please try again later",
      });
    },
    onSuccess: (updatedSettings) => {
      // Update the cache with the server response (no refetch needed)
      queryClient.setQueryData(SETTINGS_QUERY_KEY, updatedSettings);

      toast.success("Settings updated successfully", {
        description: "Your changes have been saved",
      });
    },
    // No onSettled callback - we don't want to refetch after mutation
  });
}
