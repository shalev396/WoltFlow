import { SESEvent } from "aws-lambda";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { simpleParser, ParsedMail } from "mailparser";
import { Inbox, Emails } from "../../models/index.js";
import sequelize from "../../config/database.js";
import { syncDatabase } from "../../config/bootstrap.js";

const AWS_REGION = process.env["AWS_REGION"];

if (!AWS_REGION) {
  throw new Error(`Missing  environment variable: AWS_REGION=${AWS_REGION}`);
}

// Initialize AWS services
const s3 = new S3Client({
  region: AWS_REGION,
});

// Connect to database
await sequelize.authenticate();
await syncDatabase();

/**
 * Lambda function to process incoming emails from SES
 * Triggered by SES when emails are received to our domain
 */
export const handler = async (event: SESEvent) => {
  console.log("SES Email Event:", JSON.stringify(event, null, 2));

  try {
    const results = [];

    for (const record of event.Records) {
      if (record.eventSource === "aws:ses") {
        const result = await processEmailRecord(record);
        results.push(result);
      }
    }

    console.log("Processed email records:", results);
    return { processed: results.length };
  } catch (error) {
    console.error("Error processing SES event:", error);
    throw error;
  }
};

/**
 * Process a single SES email record
 */
async function processEmailRecord(record: any) {
  const sesMessage = record.ses.mail;
  const recipients = sesMessage.destination;

  // Process each recipient
  const results = [];
  for (const userEmail of recipients) {
    try {
      console.log(`Processing email for: ${userEmail}`);

      // Extract user ID from email (format: {userId}@{subdomain})
      const userId = extractUserIdFromEmail(userEmail);
      if (!userId) {
        console.warn(`Could not extract user ID from email: ${userEmail}`);
        continue;
      }

      // Find user's inbox
      const inbox = await Inbox.findOne({ where: { userId } });
      if (!inbox) {
        console.warn(`No inbox found for user ID: ${userId}`);
        continue;
      }

      // Get S3 location of email (SES already uploaded it)
      // First try to get S3 location from SES record
      let s3Location = record.ses.receipt?.action?.s3;

      // If not found, construct it manually (SES saves with messageId as filename under raw/ prefix)
      if (!s3Location) {
        console.log(
          "S3 location not found in SES record, constructing manually..."
        );
        const bucketName =
          process.env[
            `S3_EMAIL_BUCKET_NAME_${process.env["ENV"]?.toUpperCase()}`
          ];
        if (!bucketName) {
          throw new Error(
            "Could not determine S3 bucket name from environment variables"
          );
        }

        s3Location = {
          bucketName: bucketName,
          objectKey: `raw/${sesMessage.messageId}`,
        };
        console.log("Constructed S3 location:", s3Location);
      }

      // Create date-based path for better organization
      const processingDate = new Date();
      const datePath = formatDatePath(processingDate);
      const emailId = uuidv4();

      // Create UUID-based folder structure for this email
      const emailFolderPath = `inbox/user/${userId}/${datePath}/${emailId}`;
      const emailFileName = `email.eml`; // Use a consistent name for the email file
      const emailFilePath = `${emailFolderPath}/${emailFileName}`;

      // Move email to the new structured path
      const finalS3Url = await moveEmailToUserPath(
        s3Location.bucketName,
        s3Location.objectKey,
        emailFilePath
      );

      // Extract email headers from SES data
      const headers = sesMessage.headers || [];
      const commonHeaders = sesMessage.commonHeaders || {};

      // Parse From header to extract name and email
      const fromHeader =
        commonHeaders.from?.[0] ||
        headers.find((header: any) => header.name.toLowerCase() === "from")
          ?.value ||
        "";
      let fromEmail = "";
      let fromName = "";

      if (fromHeader) {
        // Parse "Display Name <email@domain.com>" format
        const match =
          fromHeader.match(/^(.*?)\s*<([^>]+)>$/) ||
          fromHeader.match(/^([^<>\s]+@[^<>\s]+)$/);
        if (match) {
          if (match[2]) {
            // Format: "Name <email>"
            fromName = match[1].trim().replace(/^["']|["']$/g, ""); // Remove quotes
            fromEmail = match[2].trim();
          } else {
            // Format: just "email"
            fromEmail = match[1].trim();
          }
        }
      }

      // Extract other headers
      const subject =
        commonHeaders.subject ||
        headers.find((header: any) => header.name.toLowerCase() === "subject")
          ?.value ||
        "No Subject";
      const dateHeader =
        commonHeaders.date ||
        headers.find((header: any) => header.name.toLowerCase() === "date")
          ?.value ||
        new Date().toISOString();
      const originalEmailDate = new Date(dateHeader);

      console.log("Extracted email headers:", {
        fromEmail,
        fromName,
        subject,
        emailDate: originalEmailDate.toISOString(),
        messageId: sesMessage.messageId,
      });

      // Extract recipient info from the userEmail (the address this was sent to)
      const toEmail = userEmail;
      const toName = null; // We don't have recipient display name from SES

      // Save email record to database
      const emailRecord = await Emails.create({
        inboxId: inbox.id,
        s3EmailUrl: finalS3Url,
        attachmentUrls: [], // Will be populated later during processing

        // Email content fields
        fromEmail: fromEmail || "unknown@unknown.com",
        fromName: fromName || null,
        toEmail: toEmail,
        toName: toName,
        subject: subject,
        body: null, // Will be extracted from S3 file later during processing
        emailDate: originalEmailDate,
      });

      console.log(
        `Email saved for user ${userId}, email ID: ${emailRecord.id}`
      );

      // Parse email content and extract attachments
      try {
        await parseAndProcessEmailContent(
          s3Location.bucketName,
          emailFilePath,
          emailFolderPath,
          emailRecord
        );
        console.log(`Email content processed for email ID: ${emailRecord.id}`);
      } catch (parseError) {
        console.error(
          `Failed to parse email content for ${emailRecord.id}:`,
          parseError
        );
        // Email parsing failed, but record is still saved without body/attachments
      }

      results.push({
        userId,
        emailId: emailRecord.id,
        messageId: sesMessage.messageId,
      });
    } catch (error: any) {
      console.error(`Error processing email for ${userEmail}:`, error);
      results.push({ error: error.message, userEmail });
    }
  }

  return results;
}

/**
 * Extract user ID from email address
 * Format: {userId}@{subdomain}
 */
function extractUserIdFromEmail(email: string): string | null {
  const match = email.match(/^([a-f0-9-]{36})@/i);
  return match ? match[1]! : null;
}

/**
 * Move email from SES default path to user-specific path
 */
async function moveEmailToUserPath(
  bucketName: string,
  sourceKey: string,
  destinationPath: string
): Promise<string> {
  const destinationKey = destinationPath;

  // Copy object to new location
  await s3.send(
    new CopyObjectCommand({
      Bucket: bucketName,
      CopySource: `${bucketName}/${sourceKey}`,
      Key: destinationKey,
    })
  );

  // Delete original object
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: sourceKey,
      })
    );
  } catch (error) {
    console.warn(`Could not delete original email file: ${sourceKey}`, error);
  }

  return `s3://${bucketName}/${destinationKey}`;
}

/**
 * Parse email content and extract attachments
 */
async function parseAndProcessEmailContent(
  bucketName: string,
  emailFilePath: string,
  emailFolderPath: string,
  emailRecord: any
): Promise<void> {
  console.log(`Starting email parsing for: ${emailFilePath}`);

  try {
    // Download email file from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: emailFilePath,
    });

    const response = await s3.send(getObjectCommand);
    if (!response.Body) {
      throw new Error("No email content found in S3 object");
    }

    // Convert stream to buffer
    const emailBuffer = await streamToBuffer(response.Body);

    // Parse email content
    const parsedEmail: ParsedMail = await simpleParser(emailBuffer);

    console.log("Email parsed successfully:", {
      subject: parsedEmail.subject,
      from: parsedEmail.from?.text,
      to: Array.isArray(parsedEmail.to)
        ? parsedEmail.to.map((addr) => addr.text).join(", ")
        : parsedEmail.to?.text,
      attachmentCount: parsedEmail.attachments?.length || 0,
    });

    // Extract email body (prefer HTML, fallback to text)
    let emailBody = "";
    if (parsedEmail.html) {
      emailBody = parsedEmail.html.toString();
    } else if (parsedEmail.text) {
      emailBody = `<div style="white-space: pre-wrap;">${parsedEmail.text}</div>`;
    }

    // Process attachments
    const attachmentUrls: string[] = [];
    if (parsedEmail.attachments && parsedEmail.attachments.length > 0) {
      console.log(`Processing ${parsedEmail.attachments.length} attachments`);

      for (const attachment of parsedEmail.attachments) {
        if (attachment.content && attachment.filename) {
          const attachmentFileName = sanitizeFileName(attachment.filename);
          const attachmentPath = `${emailFolderPath}/${attachmentFileName}`;

          // Save attachment to S3
          await saveAttachmentToS3(
            bucketName,
            attachmentPath,
            attachment.content,
            attachment.contentType
          );

          // Create S3 URL (this will be used by frontend for downloading)
          const attachmentUrl = `s3://${bucketName}/${attachmentPath}`;
          attachmentUrls.push(attachmentUrl);

          console.log(`Saved attachment: ${attachmentFileName}`);
        }
      }
    }

    // Update email record in database with parsed content
    await emailRecord.update({
      body: emailBody || null,
      attachmentUrls: attachmentUrls,
    });

    console.log(
      `Email record updated with ${attachmentUrls.length} attachments`
    );
  } catch (error) {
    console.error("Error parsing email:", error);
    throw error;
  }
}

/**
 * Save attachment to S3
 */
async function saveAttachmentToS3(
  bucketName: string,
  objectKey: string,
  content: Buffer,
  contentType?: string
): Promise<void> {
  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: content,
    ContentType: contentType || "application/octet-stream",
  });

  await s3.send(putObjectCommand);
}

/**
 * Convert stream to buffer
 */
async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

/**
 * Sanitize filename for S3
 */
function sanitizeFileName(filename: string): string {
  // Remove/replace invalid characters for S3
  return filename
    .replace(/[^a-zA-Z0-9.\-_]/g, "_") // Replace invalid chars with underscore
    .replace(/_{2,}/g, "_") // Replace multiple underscores with single
    .substring(0, 100); // Limit length
}

/**
 * Format date for S3 path: YYYY/MM/DD (separate folders for year/month/day)
 */
function formatDatePath(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}
