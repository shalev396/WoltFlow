import { api } from "@/api/api";
import type {
  ApiResponse,
  NotificationSettings,
  NotificationSettingsUpdate,
  WoltSettings,
  WoltSettingsUpdate,
  RunSettings,
  RunSettingsUpdate,
} from "@/types";

export const settingsService = {
  // ============================================================================
  // NOTIFICATION SETTINGS
  // ============================================================================
  async getNotificationSettings(): Promise<NotificationSettings | null> {
    const response = await api.get<
      ApiResponse<{ notificationSettings: NotificationSettings | null }>
    >("/user/settings/notification");
    return response.data.data!.notificationSettings;
  },

  async updateNotificationSettings(
    settings: NotificationSettingsUpdate,
  ): Promise<NotificationSettings> {
    const response = await api.put<
      ApiResponse<{ notificationSettings: NotificationSettings }>
    >("/user/settings/notification", settings);
    return response.data.data!.notificationSettings;
  },

  // ============================================================================
  // WOLT SETTINGS
  // ============================================================================
  async getWoltSettings(): Promise<WoltSettings | null> {
    const response =
      await api.get<ApiResponse<{ woltSettings: WoltSettings | null }>>(
        "/user/settings/wolt",
      );
    return response.data.data!.woltSettings;
  },

  async updateWoltSettings(
    settings: WoltSettingsUpdate,
  ): Promise<WoltSettings> {
    const response = await api.put<ApiResponse<{ woltSettings: WoltSettings }>>(
      "/user/settings/wolt",
      settings,
    );
    return response.data.data!.woltSettings;
  },

  // ============================================================================
  // RUN SETTINGS
  // ============================================================================
  async getRunSettings(): Promise<RunSettings | null> {
    const response =
      await api.get<ApiResponse<{ runSettings: RunSettings | null }>>(
        "/user/settings/run",
      );
    return response.data.data!.runSettings;
  },

  async updateRunSettings(settings: RunSettingsUpdate): Promise<RunSettings> {
    const response = await api.put<ApiResponse<{ runSettings: RunSettings }>>(
      "/user/settings/run",
      settings,
    );
    return response.data.data!.runSettings;
  },

  // ============================================================================
  // API KEY
  // ============================================================================
  async generateApiKey(): Promise<{ apiKey: string }> {
    const response = await api.post<ApiResponse<{ apiKey: string }>>(
      "/user/forward/api/generate",
    );
    return response.data.data!;
  },
};
