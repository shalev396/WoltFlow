import { api } from "@/api/api";
import type {
  ApiSuccessResponse,
  ExportUserDataResponseData,
  DeleteUserResponseData,
} from "@/types";

class UserService {
  async exportUserData(): Promise<{ success: boolean; filename: string }> {
    try {
      const response = await api.get<
        ApiSuccessResponse<ExportUserDataResponseData>
      >("/user/export");
      const { downloadUrl, filename } = response.data.data;

      const fileResponse = await fetch(downloadUrl);

      if (!fileResponse.ok) {
        throw new Error(
          `Failed to fetch file: ${fileResponse.status} ${fileResponse.statusText}`,
        );
      }

      const blob = await fileResponse.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "woltflow-export.zip";
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);

      return { success: true, filename: filename || "woltflow-export.zip" };
    } catch (error) {
      console.error("Export download failed:", error);

      try {
        const response = await api.get<
          ApiSuccessResponse<ExportUserDataResponseData>
        >("/user/export");
        const { downloadUrl } = response.data.data;
        window.open(downloadUrl, "_blank");
        return { success: true, filename: "woltflow-export.zip" };
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        throw error;
      }
    }
  }

  async deleteUserAccount(): Promise<DeleteUserResponseData> {
    const response = await api.delete<
      ApiSuccessResponse<DeleteUserResponseData>
    >("/user/delete");
    return response.data.data;
  }
}

export const userService = new UserService();
