import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsService } from "@/services/settings";
import type {
  UpdateNotificationSettingsRequestBody,
  UpdateWoltSettingsRequestBody,
  UpdateRunSettingsRequestBody,
  NotificationSettingsResponseData,
  WoltSettingsResponseData,
  RunSettingsResponseData,
} from "@/types";
import { MANUAL_RUN_STATUS_KEY } from "@/queries/runs";

type NotificationSettingsData =
  NotificationSettingsResponseData["notificationSettings"];
type WoltSettingsData = WoltSettingsResponseData["woltSettings"];
type RunSettingsData = RunSettingsResponseData["runSettings"];

// ============================================================================
// QUERY KEYS
// ============================================================================
export const NOTIFICATION_SETTINGS_KEY = ["settings", "notification"] as const;
export const WOLT_SETTINGS_KEY = ["settings", "wolt"] as const;
export const RUN_SETTINGS_KEY = ["settings", "run"] as const;

// ============================================================================
// NOTIFICATION SETTINGS QUERIES
// ============================================================================
export function useNotificationSettingsQuery() {
  return useQuery({
    queryKey: NOTIFICATION_SETTINGS_KEY,
    queryFn: settingsService.getNotificationSettings,
    staleTime: 15 * 60 * 1000,
  });
}

export function useUpdateNotificationSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsService.updateNotificationSettings,
    onMutate: async (
      newSettings: UpdateNotificationSettingsRequestBody,
    ) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_SETTINGS_KEY });

      const previousSettings =
        queryClient.getQueryData<NotificationSettingsData>(
          NOTIFICATION_SETTINGS_KEY,
        );

      if (previousSettings) {
        queryClient.setQueryData<NonNullable<NotificationSettingsData>>(
          NOTIFICATION_SETTINGS_KEY,
          {
            ...previousSettings,
            ...newSettings,
            updatedAt: new Date(),
          },
        );
      }

      return { previousSettings };
    },
    onError: (_error, _newSettings, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(
          NOTIFICATION_SETTINGS_KEY,
          context.previousSettings,
        );
      }
      toast.error("Failed to update notification settings", {
        description: "Please try again later",
      });
    },
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(NOTIFICATION_SETTINGS_KEY, updatedSettings);
      toast.success("Notification settings updated successfully", {
        description: "Your changes have been saved",
      });
    },
  });
}

// ============================================================================
// WOLT SETTINGS QUERIES
// ============================================================================
export function useWoltSettingsQuery() {
  return useQuery({
    queryKey: WOLT_SETTINGS_KEY,
    queryFn: settingsService.getWoltSettings,
    staleTime: 15 * 60 * 1000,
  });
}

export function useUpdateWoltSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsService.updateWoltSettings,
    onMutate: async (newSettings: UpdateWoltSettingsRequestBody) => {
      await queryClient.cancelQueries({ queryKey: WOLT_SETTINGS_KEY });

      const previousSettings =
        queryClient.getQueryData<WoltSettingsData>(WOLT_SETTINGS_KEY);

      if (previousSettings) {
        queryClient.setQueryData<NonNullable<WoltSettingsData>>(
          WOLT_SETTINGS_KEY,
          {
            ...previousSettings,
            ...newSettings,
            updatedAt: new Date(),
          },
        );
      }

      return { previousSettings };
    },
    onError: (_error, _newSettings, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(WOLT_SETTINGS_KEY, context.previousSettings);
      }
      toast.error("Failed to update Wolt settings", {
        description: "Please try again later",
      });
    },
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(WOLT_SETTINGS_KEY, updatedSettings);
      void queryClient.invalidateQueries({ queryKey: MANUAL_RUN_STATUS_KEY });
      toast.success("Wolt settings updated successfully", {
        description: "Your changes have been saved",
      });
    },
  });
}

// ============================================================================
// RUN SETTINGS QUERIES
// ============================================================================
export function useRunSettingsQuery() {
  return useQuery({
    queryKey: RUN_SETTINGS_KEY,
    queryFn: settingsService.getRunSettings,
    staleTime: 15 * 60 * 1000,
  });
}

export function useUpdateRunSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsService.updateRunSettings,
    onMutate: async (newSettings: UpdateRunSettingsRequestBody) => {
      await queryClient.cancelQueries({ queryKey: RUN_SETTINGS_KEY });

      const previousSettings =
        queryClient.getQueryData<RunSettingsData>(RUN_SETTINGS_KEY);

      if (previousSettings) {
        queryClient.setQueryData<NonNullable<RunSettingsData>>(
          RUN_SETTINGS_KEY,
          {
            ...previousSettings,
            ...(newSettings.automationEnabled !== undefined && {
              automationEnabled: newSettings.automationEnabled,
            }),
            ...(newSettings.giftAmount !== undefined && {
              giftAmount: String(newSettings.giftAmount),
            }),
            updatedAt: new Date(),
          },
        );
      }

      return { previousSettings };
    },
    onError: (_error, _newSettings, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(RUN_SETTINGS_KEY, context.previousSettings);
      }
      toast.error("Failed to update run settings", {
        description: "Please try again later",
      });
    },
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(RUN_SETTINGS_KEY, updatedSettings);
      void queryClient.invalidateQueries({ queryKey: MANUAL_RUN_STATUS_KEY });
      toast.success("Run settings updated successfully", {
        description: "Your changes have been saved",
      });
    },
  });
}
