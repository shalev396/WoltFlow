import { api } from "@/api/api";

class UserService {
  /**
   * Export all user data as ZIP file and trigger download
   */
  async exportUserData(): Promise<{ success: boolean; filename: string }> {
    const response = await api.get("/user/export", {
      responseType: "blob",
    });

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers["content-disposition"];
    let filename = "woltflow-user-data-export.zip";

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create download link and trigger download
    const blob = new Blob([response.data], { type: "application/zip" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, filename };
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
