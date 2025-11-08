import { Op } from "sequelize";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
  Cibus2FA,
  TwoFactorAuthentication,
  Code,
  Run,
  Screenshot,
  Emails,
} from "../../models/index.js";
import { type CustomAPIGatewayProxyHandler } from "../../types/aws.js";
import { initDB } from "../../config/bootstrap.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../utils/responseUtil.js";

// Connect to database
await initDB();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

/**
 * Parse S3 URL to extract bucket name and object key
 * Format: s3://bucket-name/object-key
 */
function parseS3Url(
  s3Url: string
): { bucketName: string; objectKey: string } | null {
  const s3UrlMatch = s3Url.match(/^s3:\/\/([^/]+)\/(.+)$/);
  if (!s3UrlMatch || !s3UrlMatch[1] || !s3UrlMatch[2]) {
    console.error(`[DATA_CLEANUP] Invalid S3 URL format: ${s3Url}`);
    return null;
  }

  return {
    bucketName: s3UrlMatch[1],
    objectKey: s3UrlMatch[2],
  };
}

/**
 * Convert CloudFront URL to S3 URL for screenshots
 * CloudFront format: https://domain.com/images/filename.png
 * S3 format: s3://bucket-name/images/filename.png
 */
function convertCloudFrontUrlToS3Url(cloudFrontUrl: string): string | null {
  const assetsBucketName = process.env.S3_ASSETS_BUCKET_NAME;
  if (!assetsBucketName) {
    console.error(
      `[DATA_CLEANUP] S3_ASSETS_BUCKET_NAME environment variable not set`
    );
    return null;
  }

  try {
    const url = new URL(cloudFrontUrl);
    // Extract the path part (e.g., "/images/filename.png")
    const pathPart = url.pathname;

    // Remove leading slash and construct S3 URL
    const objectKey = pathPart.startsWith("/") ? pathPart.slice(1) : pathPart;
    const s3Url = `s3://${assetsBucketName}/${objectKey}`;

    return s3Url;
  } catch (error) {
    console.error(
      `[DATA_CLEANUP] Invalid CloudFront URL format: ${cloudFrontUrl}`,
      error
    );
    return null;
  }
}

/**
 * Delete screenshot file from S3 and log results
 */
async function deleteScreenshotFromS3(
  screenshotId: string,
  cloudFrontUrl: string
): Promise<void> {
  console.log(`[DATA_CLEANUP] Deleting screenshot ${screenshotId} from S3...`);

  try {
    // Convert CloudFront URL to S3 URL
    const s3Url = convertCloudFrontUrlToS3Url(cloudFrontUrl);
    if (!s3Url) {
      console.error(
        `[DATA_CLEANUP] Failed to convert CloudFront URL to S3 URL: ${cloudFrontUrl}`
      );
      return;
    }

    // Parse S3 URL to extract bucket and key
    const s3Info = parseS3Url(s3Url);
    if (!s3Info) {
      console.error(`[DATA_CLEANUP] Failed to parse S3 URL: ${s3Url}`);
      return;
    }

    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: s3Info.bucketName,
          Key: s3Info.objectKey,
        })
      );
      console.log(
        `[DATA_CLEANUP] Deleted screenshot file: ${cloudFrontUrl} -> ${s3Url}`
      );
    } catch (error) {
      console.error(
        `[DATA_CLEANUP] Failed to delete screenshot file ${s3Url}:`,
        error
      );
    }
  } catch (error) {
    console.error(
      `[DATA_CLEANUP] Error during S3 deletion for screenshot ${screenshotId}:`,
      error
    );
  }
}

/**
 * Delete email files from S3 and log results
 */
async function deleteEmailFromS3(
  emailId: string,
  s3EmailUrl: string,
  attachmentUrls: string[] | null
): Promise<void> {
  console.log(`[DATA_CLEANUP] Deleting email ${emailId} from S3...`);

  let deletedFiles = 0;
  let failedDeletions = 0;

  try {
    // Delete main email file
    const emailS3Info = parseS3Url(s3EmailUrl);
    if (emailS3Info) {
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: emailS3Info.bucketName,
            Key: emailS3Info.objectKey,
          })
        );
        deletedFiles++;
        console.log(`[DATA_CLEANUP] Deleted email file: ${s3EmailUrl}`);
      } catch (error) {
        failedDeletions++;
        console.error(
          `[DATA_CLEANUP] Failed to delete email file ${s3EmailUrl}:`,
          error
        );
      }
    } else {
      failedDeletions++;
    }

    // Delete attachment files
    if (attachmentUrls && attachmentUrls.length > 0) {
      console.log(
        `[DATA_CLEANUP] Deleting ${attachmentUrls.length} attachments for email ${emailId}`
      );

      for (const attachmentUrl of attachmentUrls) {
        const attachmentS3Info = parseS3Url(attachmentUrl);
        if (attachmentS3Info) {
          try {
            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: attachmentS3Info.bucketName,
                Key: attachmentS3Info.objectKey,
              })
            );
            deletedFiles++;
            console.log(`[DATA_CLEANUP] Deleted attachment: ${attachmentUrl}`);
          } catch (error) {
            failedDeletions++;
            console.error(
              `[DATA_CLEANUP] Failed to delete attachment ${attachmentUrl}:`,
              error
            );
          }
        } else {
          failedDeletions++;
        }
      }
    }

    console.log(
      `[DATA_CLEANUP] Email ${emailId} S3 cleanup completed: ${deletedFiles} deleted, ${failedDeletions} failed`
    );
  } catch (error) {
    console.error(
      `[DATA_CLEANUP] Error during S3 deletion for email ${emailId}:`,
      error
    );
  }
}

/**
 * Clean expired records from the database according to privacy policy retention
 * This function runs daily to remove data that has passed its retention period
 */
async function cleanExpiredData(): Promise<{
  totalDeleted: number;
  deletedByType: {
    cibus2FA: number;
    twoFA: number;
    codes: number;
    runs: number;
    screenshots: number;
    emails: number;
  };
  s3EmailsProcessed: number;
  s3ScreenshotsProcessed: number;
}> {
  const now = new Date();
  console.log(`[DATA_CLEANUP] Starting data cleanup at ${now.toISOString()}`);

  // Clean One-time codes (daily purge)
  console.log("[DATA_CLEANUP] Cleaning expired Cibus 2FA codes...");
  const expiredCibus2FA = await Cibus2FA.destroy({
    where: {
      dataExpiresAt: {
        [Op.lt]: now,
      },
    },
  });
  console.log(
    `[DATA_CLEANUP] Deleted ${expiredCibus2FA} expired Cibus2FA records`
  );

  console.log("[DATA_CLEANUP] Cleaning expired 2FA verification codes...");
  const expiredTwoFA = await TwoFactorAuthentication.destroy({
    where: {
      dataExpiresAt: {
        [Op.lt]: now,
      },
    },
  });
  console.log(
    `[DATA_CLEANUP] Deleted ${expiredTwoFA} expired TwoFactorAuthentication records`
  );

  console.log("[DATA_CLEANUP] Cleaning expired gift codes...");
  const expiredCodes = await Code.destroy({
    where: {
      dataExpiresAt: {
        [Op.lt]: now,
      },
    },
  });
  console.log(`[DATA_CLEANUP] Deleted ${expiredCodes} expired Code records`);

  // Clean Operational history (90 days)
  console.log("[DATA_CLEANUP] Cleaning expired run records...");
  const expiredRuns = await Run.destroy({
    where: {
      dataExpiresAt: {
        [Op.lt]: now,
      },
    },
  });
  console.log(`[DATA_CLEANUP] Deleted ${expiredRuns} expired Run records`);

  console.log("[DATA_CLEANUP] Cleaning expired screenshot records...");

  // First, get the screenshots that will be deleted to clean them from S3
  const screenshotsToDelete = await Screenshot.findAll({
    where: {
      dataExpiresAt: {
        [Op.lt]: now,
      },
    },
    attributes: ["id", "screenshotUrl"],
  });

  // Delete each screenshot from S3 before deleting database records
  for (const screenshot of screenshotsToDelete) {
    await deleteScreenshotFromS3(screenshot.id, screenshot.screenshotUrl);
  }

  // Delete the screenshot records from database
  const expiredScreenshots = await Screenshot.destroy({
    where: {
      dataExpiresAt: {
        [Op.lt]: now,
      },
    },
  });
  console.log(
    `[DATA_CLEANUP] Deleted ${expiredScreenshots} expired Screenshot records from database`
  );

  // Clean Emails (90 days) - with S3 cleanup
  console.log("[DATA_CLEANUP] Cleaning expired email records...");

  // First, get the emails that will be deleted to clean them from S3
  const emailsToDelete = await Emails.findAll({
    where: {
      dataExpiresAt: {
        [Op.lt]: now,
      },
    },
    attributes: ["id", "s3EmailUrl", "attachmentUrls"],
  });

  // Delete each email from S3 before deleting database records
  for (const email of emailsToDelete) {
    await deleteEmailFromS3(email.id, email.s3EmailUrl, email.attachmentUrls);
  }

  // Delete the email records from database
  const expiredEmails = await Emails.destroy({
    where: {
      dataExpiresAt: {
        [Op.lt]: now,
      },
    },
  });
  console.log(
    `[DATA_CLEANUP] Deleted ${expiredEmails} expired Email records from database`
  );

  // Summary
  const totalDeleted =
    expiredCibus2FA +
    expiredTwoFA +
    expiredCodes +
    expiredRuns +
    expiredScreenshots +
    expiredEmails;

  const deletedByType = {
    cibus2FA: expiredCibus2FA,
    twoFA: expiredTwoFA,
    codes: expiredCodes,
    runs: expiredRuns,
    screenshots: expiredScreenshots,
    emails: expiredEmails,
  };

  console.log(
    `[DATA_CLEANUP] Cleanup completed. Total records deleted: ${totalDeleted}. S3 emails processed: ${emailsToDelete.length}. S3 screenshots processed: ${screenshotsToDelete.length}`
  );

  return {
    totalDeleted,
    deletedByType,
    s3EmailsProcessed: emailsToDelete.length,
    s3ScreenshotsProcessed: screenshotsToDelete.length,
  };
}

/**
 * Lambda handler for scheduled data cleanup
 * Runs daily via CloudWatch Events to clean expired data per privacy policy
 */
export const handler: CustomAPIGatewayProxyHandler = async () => {
  try {
    console.log("[DATA_CLEANUP] Starting scheduled data cleanup");

    const result = await cleanExpiredData();

    return createSuccessResponse("Data cleanup completed successfully", {
      timestamp: new Date().toISOString(),
      totalDeleted: result.totalDeleted,
      deletedByType: result.deletedByType,
      s3EmailsProcessed: result.s3EmailsProcessed,
      s3ScreenshotsProcessed: result.s3ScreenshotsProcessed,
    });
  } catch (error) {
    console.error("[DATA_CLEANUP] Error during scheduled cleanup:", error);
    return createErrorResponse(getErrorMessage(error));
  }
};
