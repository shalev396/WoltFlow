import { api } from "@/api/api";
import type { GoogleUser } from "@/types";

export const authService = {
  async getMe(): Promise<GoogleUser> {
    const response = await api.get<GoogleUser>("/auth/me");
    return response.data;
  },

  async logout(): Promise<void> {
    // Call the logout endpoint to clear the HttpOnly session cookie
    await api.post("/auth/logout");
  },
};
