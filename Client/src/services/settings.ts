import { api } from "@/api/api";
import type {
  ApiResponse,
  NotificationSettings,
  NotificationSettingsUpdate,
  WoltSettings,
  WoltSettingsUpdate,
  CibusSettings,
  CibusSettingsUpdate,
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
    >("/settings/notification");
    return response.data.data!.notificationSettings;
  },

  async updateNotificationSettings(
    settings: NotificationSettingsUpdate
  ): Promise<NotificationSettings> {
    const response = await api.put<
      ApiResponse<{ notificationSettings: NotificationSettings }>
    >("/settings/notification", settings);
    return response.data.data!.notificationSettings;
  },

  // ============================================================================
  // WOLT SETTINGS
  // ============================================================================
  async getWoltSettings(): Promise<WoltSettings | null> {
    const response = await api.get<
      ApiResponse<{ woltSettings: WoltSettings | null }>
    >("/settings/wolt");
    return response.data.data!.woltSettings;
  },

  async updateWoltSettings(
    settings: WoltSettingsUpdate
  ): Promise<WoltSettings> {
    const response = await api.put<ApiResponse<{ woltSettings: WoltSettings }>>(
      "/settings/wolt",
      settings
    );
    return response.data.data!.woltSettings;
  },

  // ============================================================================
  // CIBUS SETTINGS
  // ============================================================================
  async getCibusSettings(): Promise<CibusSettings | null> {
    const response = await api.get<
      ApiResponse<{ cibusSettings: CibusSettings | null }>
    >("/settings/cibus");
    return response.data.data!.cibusSettings;
  },

  async updateCibusSettings(
    settings: CibusSettingsUpdate
  ): Promise<CibusSettings> {
    const response = await api.put<
      ApiResponse<{ cibusSettings: CibusSettings }>
    >("/settings/cibus", settings);
    return response.data.data!.cibusSettings;
  },

  // ============================================================================
  // RUN SETTINGS
  // ============================================================================
  async getRunSettings(): Promise<RunSettings | null> {
    const response = await api.get<
      ApiResponse<{ runSettings: RunSettings | null }>
    >("/settings/run");
    return response.data.data!.runSettings;
  },

  async updateRunSettings(settings: RunSettingsUpdate): Promise<RunSettings> {
    const response = await api.put<ApiResponse<{ runSettings: RunSettings }>>(
      "/settings/run",
      settings
    );
    return response.data.data!.runSettings;
  },

  // ============================================================================
  // API KEY
  // ============================================================================
  async generateApiKey(): Promise<{ apiKey: string }> {
    const response = await api.post<ApiResponse<{ apiKey: string }>>(
      "/forward/api/generate"
    );
    return response.data.data!;
  },
};
