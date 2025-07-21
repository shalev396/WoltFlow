import { api } from "@/api/api";
import type { UserSettings, UserSettingsUpdate } from "@/types";

export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    const response = await api.get<UserSettings>("/setting");
    return response.data;
  },

  async updateSettings(settings: UserSettingsUpdate): Promise<UserSettings> {
    const response = await api.post<UserSettings>("/setting", settings);
    return response.data;
  },

  async generateApiKey(): Promise<{ apiKey: string; message: string }> {
    const response = await api.post<{ apiKey: string; message: string }>(
      "/sms/generate-api-key"
    );
    return response.data;
  },

  async updateNotificationSettings(settings: {
    notificationMethod: "sms" | "email";
    notificationContact: string;
  }): Promise<UserSettings> {
    const response = await api.post<UserSettings>(
      "/setting/notification",
      settings
    );
    return response.data;
  },

  async start2FASMS(
    phoneNumber: string
  ): Promise<{ success: boolean; message: string; sessionId?: string }> {
    const response = await api.post<{
      success: boolean;
      message: string;
      sessionId?: string;
    }>("/api/settings/2fa/start", {
      method: "sms",
      contact: phoneNumber,
    });
    return response.data;
  },

  async start2FAEmail(
    email: string
  ): Promise<{ success: boolean; message: string; sessionId?: string }> {
    const response = await api.post<{
      success: boolean;
      message: string;
      sessionId?: string;
    }>("/api/settings/2fa/start", {
      method: "email",
      contact: email,
    });
    return response.data;
  },

  async verify2FASMS(
    code: string,
    sessionId?: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      "/api/settings/2fa/code",
      {
        method: "sms",
        code: code,
        sessionId: sessionId,
      }
    );
    return response.data;
  },

  async verify2FAEmail(
    code: string,
    sessionId?: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      "/api/settings/2fa/code",
      {
        method: "email",
        code: code,
        sessionId: sessionId,
      }
    );
    return response.data;
  },
};
