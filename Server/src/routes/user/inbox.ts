import { Router } from "express";
import { InboxController } from "../../controllers/index.js";

const router = Router();

// Inbox response types
export interface InboxResponseData {
  inbox: {
    id: string;
    userId: string;
    emailAddress: string;
    createdAt: Date;
    updatedAt: Date;
  };
  emails: Array<{
    id: string;
    s3EmailUrl: string;
    attachmentUrls: string[] | null;
    fromEmail: string;
    fromName: string | null;
    toEmail: string;
    toName: string | null;
    subject: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
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
}
router.get("/", InboxController.getInbox);

export interface DownloadAttachmentResponseData {
  filename: string;
  contentType: string;
  content: string;
}
router.get(
  "/:emailId/attachment/:attachmentIndex",
  InboxController.downloadAttachment,
);

export { router as inboxRouter };
