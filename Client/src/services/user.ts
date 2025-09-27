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
   * This permanently deletes the user's account and all associated data
   */
  async deleteUserAccount(): Promise<{
    success: boolean;
    message: string;
    summary: {
      deletedFromS3: {
        screenshots: number;
        emails: number;
        attachments: number;
      };
      deletedFromDatabase: {
        twoFactorAuthentications: number;
        screenshots: number;
        codes: number;
        emails: number;
        runs: number;
        cibus2FAcodes: number;
        inbox: number;
        settings: number;
        user: number;
      };
    };
  }> {
    try {
      console.log("Starting account deletion...");
      const response = await api.delete("/user/delete");

      if (response.data.success) {
        console.log("Account deletion completed:", response.data.data);
        return {
          success: true,
          message: response.data.message,
          summary: response.data.data.summary,
        };
      } else {
        throw new Error(response.data.message || "Account deletion failed");
      }
    } catch (error: unknown) {
      console.error("Account deletion failed:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { data: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
        // If there's a response but no message, use generic error
        throw new Error(
          "Account deletion failed. Please try again or contact support."
        );
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(
          "Account deletion failed. Please try again or contact support."
        );
      }
    }
  }
}

export const userService = new UserService();
