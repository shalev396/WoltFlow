// ============================================================================
// INBOX AND EMAIL TYPES
// ============================================================================
// Types for inbox and email functionality

// ============================================================================
// DATABASE MODEL TYPES
// ============================================================================

// Inbox model - matches backend Inbox schema
export interface Inbox {
  id: string; // UUID
  userId: string; // Foreign key to Users table
  emailAddress: string; // The SES-created email address
  createdAt: Date;
  updatedAt: Date;
}

// Emails model - matches backend Emails schema
export interface Email {
  id: string; // UUID for unique identification
  inboxId: string; // Foreign key to Inbox table (user's email address)
  s3EmailUrl: string; // S3 URL to the email file
  attachmentUrls: string[] | null; // Array of S3 URLs to attachments
  // Email content fields
  fromEmail: string; // Sender email address
  fromName: string | null; // Sender display name
  toEmail: string; // Recipient email address
  toName: string | null; // Recipient display name
  subject: string; // Email subject
  body: string | null; // Email body content
  emailDate: Date; // Original email date
  dataExpiresAt: Date; // Data retention expiry (90 days)
  createdAt: Date;
  updatedAt: Date;
}

export interface InboxFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}
export interface InboxResponse {
  success: boolean;
  message: string;
  data: {
    inbox: Inbox;
    emails: Email[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalEmails: number;
      emailsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters: InboxFilters;
  };
}
