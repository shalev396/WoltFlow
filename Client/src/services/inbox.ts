import { api } from "@/api/api";

export interface InboxEmail {
  id: string;
  inboxId: string;
  messageId: string;
  s3EmailUrl: string;
  s3PdfUrls: string[] | null;
  attachmentCount: number;
  processingStatus:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "skipped";
  createdAt: string;
  updatedAt: string;
}

export interface UserInbox {
  id: string;
  userId: string;
  emailAddress: string;
  sesIdentityArn: string | null;
  sesVerificationStatus: "pending" | "success" | "failed" | "temporary_failure";
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
      status: string | null;
      startDate: string | null;
      endDate: string | null;
    };
  };
}

export interface InboxFilters {
  page?: number;
  limit?: number;
  status?: "pending" | "processing" | "completed" | "failed" | "skipped";
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
    if (filters?.status) params.append("status", filters.status);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    const queryString = params.toString();
    const url = queryString ? `/inbox?${queryString}` : "/inbox";

    const response = await api.get<InboxResponse>(url);
    return response.data;
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
    }>;
    priority: "high" | "normal" | "low";
  } {
    return {
      id: email.id,
      subject: email.messageId, // For now, use messageId as subject
      from: { name: "System", email: "system@woltflow.com" },
      to: "", // Will be populated from inbox data
      date: new Date(email.createdAt),
      isRead: email.processingStatus === "completed",
      isStarred: false,
      body: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Email Processing Status: ${email.processingStatus.toUpperCase()}</h2>
          <p><strong>Message ID:</strong> ${email.messageId}</p>
          <p><strong>Processing Status:</strong> ${email.processingStatus}</p>
          <p><strong>Attachments:</strong> ${
            email.attachmentCount
          } PDF files</p>
          <p><strong>Received:</strong> ${new Date(
            email.createdAt
          ).toLocaleString()}</p>
          ${
            email.s3EmailUrl
              ? `<p><strong>Email File:</strong> <a href="${email.s3EmailUrl}" target="_blank">View Email</a></p>`
              : ""
          }
          ${
            email.s3PdfUrls && email.s3PdfUrls.length > 0
              ? `<div>
              <h3>PDF Attachments:</h3>
              <ul>
                ${email.s3PdfUrls
                  .map(
                    (pdfUrl, index) =>
                      `<li><a href="${pdfUrl}" target="_blank">PDF Attachment ${
                        index + 1
                      }</a></li>`
                  )
                  .join("")}
              </ul>
            </div>`
              : ""
          }
        </div>
      `,
      labels: [email.processingStatus, "inbox"],
      hasAttachments: email.attachmentCount > 0,
      attachments: email.s3PdfUrls
        ? email.s3PdfUrls.map((pdfUrl, index) => ({
            id: `att_${email.id}_${index}`,
            name: `attachment_${index + 1}.pdf`,
            size: 0, // Size not available from backend yet
            type: "application/pdf",
          }))
        : undefined,
      priority: email.processingStatus === "failed" ? "high" : "normal",
    };
  }
}

export const inboxService = new InboxService();
