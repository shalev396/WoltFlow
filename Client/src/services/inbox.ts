import { api } from "@/api/api";
import type {
  ApiSuccessResponse,
  InboxResponseData,
  InboxFilters,
} from "@/types";

class InboxService {
  async getInbox(
    filters?: InboxFilters,
  ): Promise<InboxResponseData> {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    const queryString = params.toString();
    const url = queryString ? `/user/inbox?${queryString}` : "/user/inbox";

    const response =
      await api.get<ApiSuccessResponse<InboxResponseData>>(url);
    return response.data.data;
  }

  async downloadAttachment(
    emailId: string,
    attachmentIndex: number,
  ): Promise<Blob> {
    const response = await api.get(
      `/user/inbox/${emailId}/attachment/${attachmentIndex}`,
      { responseType: "blob" },
    );
    return response.data;
  }

  async downloadAndSaveAttachment(
    emailId: string,
    attachmentIndex: number,
    filename: string,
  ): Promise<void> {
    try {
      const blob = await this.downloadAttachment(emailId, attachmentIndex);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download attachment:", error);
      throw new Error(`Failed to download attachment: ${error}`);
    }
  }
}
export const inboxService = new InboxService();
