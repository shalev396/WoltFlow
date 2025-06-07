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
};
