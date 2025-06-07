import { api } from "@/api/api";
import type { GoogleUser } from "@/types";

export const authService = {
  async getMe(): Promise<GoogleUser> {
    const response = await api.get<GoogleUser>("/auth/me");
    return response.data;
  },

  async logout(): Promise<void> {
    // Clear cookies and local storage if needed
    document.cookie =
      "sessionToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  },
};
