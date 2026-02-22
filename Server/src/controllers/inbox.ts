import { type RequestHandler } from "express";
import { Inbox, Email } from "../classes/index.js";
import { type AuthenticatedRequest } from "../types/express.js";

export class InboxController {
  static getInbox: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest & {
        query: {
          page?: string;
          limit?: string;
          startDate?: string;
          endDate?: string;
        };
      };
      const userId = authReq.user.id;

      const page = parseInt(authReq.query.page || "1", 10);
      const limit = Math.min(parseInt(authReq.query.limit || "20", 10), 100);

      const inbox = await Inbox.findOrCreateForUser(userId);

      const data = await Email.getForInbox(inbox.id, inbox.toJSON(), {
        page,
        limit,
        ...(authReq.query.startDate ? { startDate: authReq.query.startDate } : {}),
        ...(authReq.query.endDate ? { endDate: authReq.query.endDate } : {}),
      });

      res.success(data);
    } catch (error) {
      console.error("Error in getInbox:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retrieve inbox";
      res.error(errorMessage, 500);
    }
  };

  static downloadAttachment: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest & {
        params: { emailId: string; attachmentIndex: string };
      };
      const userId = authReq.user.id;
      const { emailId, attachmentIndex } = authReq.params;

      if (!emailId || attachmentIndex === undefined) {
        res.error("Missing required parameters: emailId and attachmentIndex", 400);
        return;
      }

      const attachmentIdx = parseInt(attachmentIndex, 10);
      if (isNaN(attachmentIdx) || attachmentIdx < 0) {
        res.error("Invalid attachment index", 400);
        return;
      }

      const data = await Email.downloadAttachment(emailId, userId, attachmentIdx);
      res.success(data);
    } catch (error) {
      console.error("Error downloading attachment:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to download attachment";
      const statusCode = errorMessage.includes("not found") || errorMessage.includes("permission") ? 404
        : errorMessage.includes("Invalid") || errorMessage.includes("missing") ? 400
        : 500;
      res.error(errorMessage, statusCode);
    }
  };
}
