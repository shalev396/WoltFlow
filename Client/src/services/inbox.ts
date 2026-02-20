import { api } from "@/api/api";
import type { InboxFilters, InboxResponse } from "@/types/index";

class InboxService {
  /**
   * Get user's inbox and emails
   */
  async getInbox(filters?: InboxFilters): Promise<InboxResponse> {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    const queryString = params.toString();
    const url = queryString ? `/user/inbox?${queryString}` : "/user/inbox";

    const response = await api.get<InboxResponse>(url);
    return response.data;
  }

  /**
   * Download attachment securely
   */
  async downloadAttachment(
    emailId: string,
    attachmentIndex: number,
  ): Promise<Blob> {
    const response = await api.get(
      `/user/inbox/${emailId}/attachment/${attachmentIndex}`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  }

  /**
   * Download attachment and trigger file download in browser
   */
  async downloadAndSaveAttachment(
    emailId: string,
    attachmentIndex: number,
    filename: string,
  ): Promise<void> {
    try {
      const blob = await this.downloadAttachment(emailId, attachmentIndex);

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download attachment:", error);
      throw new Error(`Failed to download attachment: ${error}`);
    }
  }
}
export const inboxService = new InboxService();
