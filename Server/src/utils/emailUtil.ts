import {
  SESClient,
  SendEmailCommand,
  type SendEmailCommandInput,
} from "@aws-sdk/client-ses";

// Initialize SES client for il-central-1 region
const sesClient = new SESClient({ region: "il-central-1" });

// Default sender email - must be verified in SES
const AUTHENTICATOR_SENDER_EMAIL = `authenticator@${process.env.DOMAIN_NAME}`;
const AUTHENTICATOR_SENDER_NAME = "WoltFlow Authenticator";

export interface SendEmailOptions {
  to: string | string[]; // Single email or array of emails
  subject: string;
  htmlBody?: string; // HTML content
  textBody?: string; // Plain text content
  from?: string; // Sender email (must be verified in SES)
  fromName?: string; // Sender display name
  replyTo?: string; // Reply-to email address
  cc?: string | string[]; // CC recipients
  bcc?: string | string[]; // BCC recipients
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send email using AWS SES
 * @param options Email sending options
 * @returns Promise with result of email sending
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  try {
    const {
      to,
      subject,
      htmlBody,
      textBody,
      from = AUTHENTICATOR_SENDER_EMAIL,
      fromName = AUTHENTICATOR_SENDER_NAME,
      replyTo,
      cc,
      bcc,
    } = options;

    // Validate required fields
    if (!to || (Array.isArray(to) && to.length === 0)) {
      return {
        success: false,
        error: "Recipient email address is required.",
      };
    }

    if (!subject || subject.trim().length === 0) {
      return {
        success: false,
        error: "Email subject is required.",
      };
    }

    if (!htmlBody && !textBody) {
      return {
        success: false,
        error: "Email must have either HTML body or text body (or both).",
      };
    }

    // Validate email addresses
    const toEmails = Array.isArray(to) ? to : [to];
    for (const email of toEmails) {
      if (!isValidEmail(email)) {
        return {
          success: false,
          error: `Invalid recipient email address: ${email}`,
        };
      }
    }

    if (!isValidEmail(from)) {
      return {
        success: false,
        error: `Invalid sender email address: ${from}`,
      };
    }

    // Format sender address
    const senderAddress = fromName ? `${fromName} <${from}>` : from;

    // Prepare email input
    const emailInput: SendEmailCommandInput = {
      Source: senderAddress,
      Destination: {
        ToAddresses: toEmails,
        CcAddresses: cc ? (Array.isArray(cc) ? cc : [cc]) : undefined,
        BccAddresses: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: htmlBody
            ? {
                Data: htmlBody,
                Charset: "UTF-8",
              }
            : undefined,
          Text: textBody
            ? {
                Data: textBody,
                Charset: "UTF-8",
              }
            : undefined,
        },
      },
      ReplyToAddresses: replyTo ? [replyTo] : undefined,
    };

    const sendCommand = new SendEmailCommand(emailInput);
    const result = await sesClient.send(sendCommand);

    console.log(
      `Email sent successfully to ${toEmails.join(", ")}:`,
      result.MessageId
    );

    return {
      success: true,
      messageId: result.MessageId || "unknown",
    };
  } catch (error) {
    console.error("Error sending email:", error);

    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Validate email address format
 * @param email Email address to validate
 * @returns boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
}

/**
 * Normalize email address (trim and lowercase)
 * @param email Email address to normalize
 * @returns Normalized email address or null if invalid
 */
export function normalizeEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  return isValidEmail(trimmed) ? trimmed : null;
}
