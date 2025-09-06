import { api } from "@/api/api";

export interface InboxEmail {
  id: string;
  s3EmailUrl: string;
  attachmentUrls: string[] | null;

  // Email content fields
  fromEmail: string;
  fromName: string | null;
  toEmail: string;
  toName: string | null;
  subject: string;
  body: string | null;
  emailDate: string;

  createdAt: string;
  updatedAt: string;
}

export interface UserInbox {
  id: string;
  userId: string;
  emailAddress: string;
  sesIdentityArn: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface InboxResponse {
  success: boolean;
  data: {
    inbox: UserInbox;
    emails: InboxEmail[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
    filters: {
      startDate: string | null;
      endDate: string | null;
    };
  };
}

export interface InboxFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

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
    const url = queryString ? `/inbox?${queryString}` : "/inbox";

    const response = await api.get<InboxResponse>(url);
    return response.data;
  }

  /**
   * Download attachment securely
   */
  async downloadAttachment(
    emailId: string,
    attachmentIndex: number
  ): Promise<Blob> {
    const response = await api.get(
      `/inbox/${emailId}/attachment/${attachmentIndex}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  }

  /**
   * Download attachment and trigger file download in browser
   */
  async downloadAndSaveAttachment(
    emailId: string,
    attachmentIndex: number,
    filename: string
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

  /**
   * Transform backend email to frontend email format
   */
  transformEmailForUI(email: InboxEmail): {
    id: string;
    subject: string;
    from: { name: string; email: string };
    to: string;
    date: Date;
    isRead: boolean;
    isStarred: boolean;
    body: string;
    labels: string[];
    hasAttachments: boolean;
    attachments?: Array<{
      id: string;
      name: string;
      size: number;
      type: string;
      url?: string;
    }>;
    priority: "high" | "normal" | "low";
  } {
    const attachmentCount = email.attachmentUrls?.length || 0;

    return {
      id: email.id,
      subject: email.subject || "No Subject",
      from: {
        name: email.fromName || email.fromEmail.split("@")[0],
        email: email.fromEmail,
      },
      to: email.toEmail || "",
      date: new Date(email.emailDate || email.createdAt),
      isRead: true, // All emails are considered read since we don't track read status
      isStarred: false,
      body: email.body || this.generateEmailBodyFallback(email),
      labels: ["inbox"],
      hasAttachments: attachmentCount > 0,
      attachments: email.attachmentUrls
        ? email.attachmentUrls.map((attachmentUrl, index) => ({
            id: `att_${email.id}_${index}`,
            name:
              this.getFileNameFromS3Url(attachmentUrl) ||
              `attachment_${index + 1}`,
            size: 0, // Size not available from backend yet
            type: this.getFileTypeFromName(attachmentUrl),
            url: attachmentUrl,
          }))
        : undefined,
      priority: "normal",
    };
  }

  /**
   * Generate fallback email body when body is not available
   */
  private generateEmailBodyFallback(email: InboxEmail): string {
    const attachmentCount = email.attachmentUrls?.length || 0;

    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 16px;">📧 Email Content</h2>
        
        <div style="background: #f8f9fa; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
          <p style="margin: 8px 0;"><strong>From:</strong> ${
            email.fromName || email.fromEmail
          }</p>
          <p style="margin: 8px 0;"><strong>To:</strong> ${email.toEmail}</p>
          <p style="margin: 8px 0;"><strong>Received:</strong> ${new Date(
            email.emailDate || email.createdAt
          ).toLocaleString()}</p>
        </div>

        ${
          attachmentCount > 0
            ? `
          <div style="background: #e3f2fd; padding: 12px; border-radius: 6px; border-left: 4px solid #2196f3;">
            <p style="margin: 0; color: #1976d2;"><strong>📎 ${attachmentCount} attachment${
                attachmentCount > 1 ? "s" : ""
              } available</strong></p>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">Use the attachment buttons above to download files.</p>
          </div>
        `
            : ""
        }
        
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
          <p style="margin: 0;">Email content is being loaded...</p>
        </div>
      </div>
    `;
  }

  /**
   * Extract filename from S3 URL
   */
  private getFileNameFromS3Url(s3Url: string): string | null {
    try {
      // Extract filename from S3 path: s3://bucket/path/to/filename.ext
      const parts = s3Url.split("/");
      return parts[parts.length - 1] || null;
    } catch {
      return null;
    }
  }

  /**
   * Get file type from filename
   */
  private getFileTypeFromName(filename: string): string {
    const extension = filename.toLowerCase().split(".").pop();
    switch (extension) {
      case "pdf":
        return "application/pdf";
      case "doc":
      case "docx":
        return "application/msword";
      case "xls":
      case "xlsx":
        return "application/vnd.ms-excel";
      case "ppt":
      case "pptx":
        return "application/vnd.ms-powerpoint";
      case "txt":
        return "text/plain";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      default:
        return "application/octet-stream";
    }
  }
}

export const inboxService = new InboxService();
