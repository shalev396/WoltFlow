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
      "/generate-api-key"
    );
    return response.data;
  },
};
