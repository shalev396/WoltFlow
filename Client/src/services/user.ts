import { api } from "@/api/api";
import { type ExportResponse } from "@/types/export";

class UserService {
  /**
   * Export all user data
   */
  async exportUserData(): Promise<ExportResponse> {
    const response = await api.get<ExportResponse>("/user/export");
    return response.data;
  }

  /**
   * Delete user account and all data
   * Note: This is a placeholder for now - backend implementation will be added later
   */
  async deleteUserAccount(): Promise<{ success: boolean; message: string }> {
    // This will be implemented later with proper backend endpoint
    throw new Error("Delete account functionality is not yet implemented");
  }
}

export const userService = new UserService();
