import { api } from "@/api/api";

class UserService {
  /**
   * Export all user data as ZIP file and trigger download via presigned S3 URL
   */
  async exportUserData(): Promise<{ success: boolean; filename: string }> {
    try {
      // Get the download URL from the API
      const response = await api.get("/user/export");
      const { downloadUrl, filename } = response.data.data;

      console.log("Download URL received:", downloadUrl);
      console.log("Filename:", filename);

      // Fetch the file from S3 as a blob to ensure proper download
      console.log("Fetching ZIP file from S3...");
      const fileResponse = await fetch(downloadUrl);

      if (!fileResponse.ok) {
        throw new Error(
          `Failed to fetch file: ${fileResponse.status} ${fileResponse.statusText}`
        );
      }

      const blob = await fileResponse.blob();
      console.log("ZIP file downloaded, size:", blob.size, "bytes");

      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "woltflow-export.zip";
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        console.log("Download cleanup completed");
      }, 1000);

      return { success: true, filename: filename || "woltflow-export.zip" };
    } catch (error) {
      console.error("Export download failed:", error);

      // Fallback: if blob download fails, try direct URL
      try {
        const response = await api.get("/user/export");
        const { downloadUrl } = response.data.data;
        console.log("Fallback: Opening download URL in new tab");
        window.open(downloadUrl, "_blank");
        return { success: true, filename: "woltflow-export.zip" };
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        throw error;
      }
    }
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
