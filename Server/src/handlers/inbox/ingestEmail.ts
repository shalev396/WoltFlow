import { SESEvent } from "aws-lambda";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Inbox, Emails } from "../../models/index.js";
import sequelize from "../../config/database.js";
import { syncDatabase } from "../../config/bootstrap.js";

// Initialize AWS services
const s3 = new AWS.S3();

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
      const s3Location = record.ses.receipt?.action?.s3;
      if (!s3Location) {
        throw new Error("No S3 location found in SES record");
      }

      // Create date-based path for better organization
      const emailDate = new Date();
      const datePath = formatDatePath(emailDate);
      const emailId = uuidv4();

      // Move email to user-specific path
      const userEmailPath = `raw/user/${userId}/${datePath}/${emailId}`;
      const finalS3Url = await moveEmailToUserPath(
        s3Location.bucketName,
        s3Location.objectKey,
        userEmailPath
      );

      // Save email record to database
      const emailRecord = await Emails.create({
        inboxId: inbox.id,
        messageId: sesMessage.messageId,
        s3EmailUrl: finalS3Url,
        s3PdfUrls: [], // Will be populated later during processing
        attachmentCount: 0, // Will be updated during processing
        processingStatus: "pending",
      });

      console.log(
        `Email saved for user ${userId}, email ID: ${emailRecord.id}`
      );
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
  userPath: string
): Promise<string> {
  const destinationKey = `${userPath}/email.eml`;

  // Copy object to new location
  await s3
    .copyObject({
      Bucket: bucketName,
      CopySource: `${bucketName}/${sourceKey}`,
      Key: destinationKey,
    })
    .promise();

  // Delete original object
  try {
    await s3
      .deleteObject({
        Bucket: bucketName,
        Key: sourceKey,
      })
      .promise();
  } catch (error) {
    console.warn(`Could not delete original email file: ${sourceKey}`, error);
  }

  return `s3://${bucketName}/${destinationKey}`;
}

/**
 * Format date for S3 path: YYYY-MM-DD
 */
function formatDatePath(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
