import { api } from "@/api/api";
import type {
  ApiSuccessResponse,
  NotificationSettingsResponseData,
  UpdateNotificationSettingsRequestBody,
  WoltSettingsResponseData,
  UpdateWoltSettingsRequestBody,
  RunSettingsResponseData,
  UpdateRunSettingsRequestBody,
} from "@/types";

export const settingsService = {
  // ============================================================================
  // NOTIFICATION SETTINGS
  // ============================================================================
  async getNotificationSettings(): Promise<
    NotificationSettingsResponseData["notificationSettings"]
  > {
    const response = await api.get<
      ApiSuccessResponse<NotificationSettingsResponseData>
    >("/user/settings/notification");
    return response.data.data.notificationSettings;
  },

  async updateNotificationSettings(
    settings: UpdateNotificationSettingsRequestBody,
  ): Promise<
    NonNullable<NotificationSettingsResponseData["notificationSettings"]>
  > {
    const response = await api.put<
      ApiSuccessResponse<NotificationSettingsResponseData>
    >("/user/settings/notification", settings);
    return response.data.data.notificationSettings!;
  },

  // ============================================================================
  // WOLT SETTINGS
  // ============================================================================
  async getWoltSettings(): Promise<
    WoltSettingsResponseData["woltSettings"]
  > {
    const response = await api.get<
      ApiSuccessResponse<WoltSettingsResponseData>
    >("/user/settings/wolt");
    return response.data.data.woltSettings;
  },

  async updateWoltSettings(
    settings: UpdateWoltSettingsRequestBody,
  ): Promise<NonNullable<WoltSettingsResponseData["woltSettings"]>> {
    const response = await api.put<
      ApiSuccessResponse<WoltSettingsResponseData>
    >("/user/settings/wolt", settings);
    return response.data.data.woltSettings!;
  },

  // ============================================================================
  // RUN SETTINGS
  // ============================================================================
  async getRunSettings(): Promise<
    RunSettingsResponseData["runSettings"]
  > {
    const response = await api.get<
      ApiSuccessResponse<RunSettingsResponseData>
    >("/user/settings/run");
    return response.data.data.runSettings;
  },

  async updateRunSettings(
    settings: UpdateRunSettingsRequestBody,
  ): Promise<NonNullable<RunSettingsResponseData["runSettings"]>> {
    const response = await api.put<
      ApiSuccessResponse<RunSettingsResponseData>
    >("/user/settings/run", settings);
    return response.data.data.runSettings!;
  },
};
