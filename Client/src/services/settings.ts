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

  // Save notification settings (both phone and email)
  async saveNotificationSettings(settings: {
    notificationMethod?: "sms" | "email" | null;
    phoneNumber?: string | null;
    phoneVerified?: boolean;
    email?: string | null;
    emailVerified?: boolean;
  }): Promise<UserSettings> {
    const response = await api.post<UserSettings>(
      "/setting/notification",
      settings
    );
    return response.data;
  },

  // Start 2FA verification for phone or email
  async start2FA(settings: {
    method: "sms" | "email";
    contact: string; // phone number or email
  }): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{
      success: boolean;
      message: string;
      // sessionId?: string;
    }>("/setting/2FA/start", settings);
    return response.data;
  },

  // Verify 2FA code
  async verify2FA(settings: {
    method: "sms" | "email";
    code: string;
    // sessionId?: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      "/setting/2FA/code",
      settings
    );
    return response.data;
  },
};
