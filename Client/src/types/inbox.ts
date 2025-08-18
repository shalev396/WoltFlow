// ============================================================================
// INBOX AND EMAIL TYPES
// ============================================================================
// Types for frontend email display and interaction

export interface Email {
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
}
