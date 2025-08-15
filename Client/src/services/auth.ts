import { api } from "@/api/api";
import type { GoogleUser, ApiResponse } from "@/types";

export const authService = {
  async getMe(): Promise<GoogleUser> {
    const response = await api.get<ApiResponse<{ user: GoogleUser }>>(
      "/auth/me"
    );
    return response.data.data!.user;
  },

  async logout(): Promise<void> {
    // Call the logout endpoint to clear the HttpOnly session cookie
    await api.post<ApiResponse>("/auth/logout");
  },

  // OAuth flows are handled by direct navigation, not API calls
  startOAuth(): void {
    window.location.href = `${api.defaults.baseURL}/oauth2/start`;
  },
};
