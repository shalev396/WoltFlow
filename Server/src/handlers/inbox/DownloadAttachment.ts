import { type APIGatewayProxyResult } from "aws-lambda";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Emails, Inbox } from "../../models/index.js";
import { createErrorResponse } from "../../utils/responseUtil.js";
import { authMiddleware } from "../../middlewares/auth.js";
import {
  type CustomAPIGatewayProxyHandler,
  type ICustomAPIGatewayProxyEventAuth,
  type EmailsWithInbox,
} from "../../types/index.js";
import { initDB } from "../../config/bootstrap.js";
import { Readable } from "stream";
import type { NodeJsClient } from "@smithy/types";

// Connect to database
await initDB();

// Initialize AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
}) as NodeJsClient<S3Client>;

/**
 * Download attachment securely - user can only download their own email attachments
 */
export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (
    event: ICustomAPIGatewayProxyEventAuth
  ): Promise<APIGatewayProxyResult> => {
    try {
      const userId = event.userId!;
      const { emailId, attachmentIndex } = event.pathParameters || {};

      if (!emailId || attachmentIndex === undefined) {
        return createErrorResponse(
          "Missing required parameters: emailId and attachmentIndex"
        );
      }

      // Validate attachmentIndex is a valid number
      const attachmentIdx = parseInt(attachmentIndex, 10);
      if (isNaN(attachmentIdx) || attachmentIdx < 0) {
        return createErrorResponse("Invalid attachment index");
      }

      // Find the email and verify it belongs to the user
      const email =
        ((await Emails.findOne({
          where: { id: emailId },
          include: [
            {
              model: Inbox,
              as: "inbox",
              where: { userId }, // This ensures the email belongs to the user
              required: true,
            },
          ],
        })) as EmailsWithInbox) || null;

      if (!email) {
        return createErrorResponse(
          "Email not found or you don't have permission to access it"
        );
      }

      // Check if the attachment exists
      if (
        !email.attachmentUrls ||
        attachmentIdx >= email.attachmentUrls.length
      ) {
        return createErrorResponse("Attachment not found");
      }

      const attachmentUrl = email.attachmentUrls[attachmentIdx];
      if (!attachmentUrl) {
        return createErrorResponse("Attachment URL is missing");
      }

      // Parse S3 URL to extract bucket and key
      const s3UrlMatch = attachmentUrl.match(/^s3:\/\/([^\/]+)\/(.+)$/);
      if (!s3UrlMatch || s3UrlMatch.length < 3) {
        return createErrorResponse("Invalid attachment URL format");
      }

      const [, bucketName, objectKey] = s3UrlMatch;
      if (!bucketName || !objectKey) {
        return createErrorResponse("Invalid S3 bucket or key");
      }

      // Download file from S3
      const getObjectCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      });

      const s3Response = await s3.send(getObjectCommand);
      if (!s3Response.Body) {
        return createErrorResponse("Attachment file not found in storage");
      }

      // Convert stream to buffer
      const fileBuffer = await streamToBuffer(s3Response.Body);

      // Extract filename from the S3 key
      const filename = objectKey.split("/").pop() || "attachment";

      // Return file as response
      return {
        statusCode: 200,
        headers: {
          "Content-Type": s3Response.ContentType || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": fileBuffer.length.toString(),
        },
        body: fileBuffer.toString("base64"),
        isBase64Encoded: true,
      };
    } catch (error) {
      console.error("Error in downloadAttachment handler:", error);
      return createErrorResponse(
        error instanceof Error ? error.message : "Failed to download attachment"
      );
    }
  }
);

/**
 * Convert stream to buffer
 */
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
