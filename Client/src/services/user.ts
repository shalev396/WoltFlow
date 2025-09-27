import { api } from "@/api/api";

class UserService {
  /**
   * Export all user data as ZIP file and trigger download via presigned S3 URL
   */
  async exportUserData(): Promise<{ success: boolean; filename: string }> {
    // Get the download URL from the API
    const response = await api.get("/user/export");
    const { downloadUrl, filename } = response.data.data;

    // Create a temporary link to download the file from S3
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    link.target = "_blank"; // Open in new tab to handle large files better

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);

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
