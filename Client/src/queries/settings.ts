import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsService } from "@/services/settings";
import type {
  NotificationSettings,
  NotificationSettingsUpdate,
  WoltSettings,
  WoltSettingsUpdate,
  CibusSettings,
  CibusSettingsUpdate,
  RunSettings,
  RunSettingsUpdate,
} from "@/types";

// ============================================================================
// QUERY KEYS
// ============================================================================
export const NOTIFICATION_SETTINGS_KEY = ["settings", "notification"] as const;
export const WOLT_SETTINGS_KEY = ["settings", "wolt"] as const;
export const CIBUS_SETTINGS_KEY = ["settings", "cibus"] as const;
export const RUN_SETTINGS_KEY = ["settings", "run"] as const;

// ============================================================================
// NOTIFICATION SETTINGS QUERIES
// ============================================================================
export function useNotificationSettingsQuery() {
  return useQuery({
    queryKey: NOTIFICATION_SETTINGS_KEY,
    queryFn: settingsService.getNotificationSettings,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useUpdateNotificationSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsService.updateNotificationSettings,
    onMutate: async (newSettings: NotificationSettingsUpdate) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_SETTINGS_KEY });

      const previousSettings =
        queryClient.getQueryData<NotificationSettings | null>(
          NOTIFICATION_SETTINGS_KEY
        );

      if (previousSettings) {
        queryClient.setQueryData<NotificationSettings>(
          NOTIFICATION_SETTINGS_KEY,
          {
            ...previousSettings,
            ...newSettings,
            updatedAt: new Date(),
          }
        );
      }

      return { previousSettings };
    },
    onError: (_error, _newSettings, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(
          NOTIFICATION_SETTINGS_KEY,
          context.previousSettings
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
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useUpdateWoltSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsService.updateWoltSettings,
    onMutate: async (newSettings: WoltSettingsUpdate) => {
      await queryClient.cancelQueries({ queryKey: WOLT_SETTINGS_KEY });

      const previousSettings = queryClient.getQueryData<WoltSettings | null>(
        WOLT_SETTINGS_KEY
      );

      if (previousSettings) {
        queryClient.setQueryData<WoltSettings>(WOLT_SETTINGS_KEY, {
          ...previousSettings,
          ...newSettings,
          updatedAt: new Date(),
        });
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
      toast.success("Wolt settings updated successfully", {
        description: "Your changes have been saved",
      });
    },
  });
}

// ============================================================================
// CIBUS SETTINGS QUERIES
// ============================================================================
export function useCibusSettingsQuery() {
  return useQuery({
    queryKey: CIBUS_SETTINGS_KEY,
    queryFn: settingsService.getCibusSettings,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useUpdateCibusSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsService.updateCibusSettings,
    onMutate: async (newSettings: CibusSettingsUpdate) => {
      await queryClient.cancelQueries({ queryKey: CIBUS_SETTINGS_KEY });

      const previousSettings = queryClient.getQueryData<CibusSettings | null>(
        CIBUS_SETTINGS_KEY
      );

      if (previousSettings) {
        queryClient.setQueryData<CibusSettings>(CIBUS_SETTINGS_KEY, {
          ...previousSettings,
          ...newSettings,
          updatedAt: new Date(),
        });
      }

      return { previousSettings };
    },
    onError: (_error, _newSettings, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(CIBUS_SETTINGS_KEY, context.previousSettings);
      }
      toast.error("Failed to update Cibus settings", {
        description: "Please try again later",
      });
    },
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(CIBUS_SETTINGS_KEY, updatedSettings);
      toast.success("Cibus settings updated successfully", {
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
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useUpdateRunSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsService.updateRunSettings,
    onMutate: async (newSettings: RunSettingsUpdate) => {
      await queryClient.cancelQueries({ queryKey: RUN_SETTINGS_KEY });

      const previousSettings = queryClient.getQueryData<RunSettings | null>(
        RUN_SETTINGS_KEY
      );

      if (previousSettings) {
        queryClient.setQueryData<RunSettings>(RUN_SETTINGS_KEY, {
          ...previousSettings,
          ...newSettings,
          updatedAt: new Date(),
        });
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
      toast.success("Run settings updated successfully", {
        description: "Your changes have been saved",
      });
    },
  });
}
