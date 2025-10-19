import { type CustomAPIGatewayProxyHandler } from "../../types/index.js";
import { initDB } from "../../config/bootstrap.js";
import {
  User,
  Settings,
  NotificationSettings,
  WoltSettings,
  CibusSettings,
  RunSettings,
  TwoFactorAuthentication,
  Inbox,
  Emails,
  Run,
  Screenshot,
  Code,
  Cibus2FA,
} from "../../models/index.js";
import { authMiddleware } from "../../middlewares/auth.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../utils/responseUtil.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Connect to database
await initDB();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

/**
 * Parse S3 URL to extract bucket name and object key
 */
function parseS3Url(
  s3Url: string
): { bucketName: string; objectKey: string } | null {
  try {
    const url = new URL(s3Url);
    const bucketName = url.hostname.split(".")[0];
    const objectKey = url.pathname.substring(1); // Remove leading slash

    if (!bucketName || !objectKey) {
      console.error(`Invalid S3 URL format: ${s3Url}`);
      return null;
    }

    return { bucketName, objectKey };
  } catch (error) {
    console.error(`Failed to parse S3 URL: ${s3Url}`, error);
    return null;
  }
}

/**
 * Convert CloudFront URL to S3 URL for deletion
 */
function convertCloudFrontUrlToS3Url(cloudFrontUrl: string): string | null {
  try {
    const url = new URL(cloudFrontUrl);
    const pathParts = url.pathname.split("/");

    // Expected format: /images/screenshots/...
    if (pathParts.length >= 3 && pathParts[1] === "images") {
      const s3Key = `images/${pathParts.slice(2).join("/")}`;
      const bucketName = process.env.S3_ASSETS_BUCKET_NAME;
      const awsRegion = process.env.AWS_REGION;

      if (!bucketName || !awsRegion) {
        console.error(
          "Missing required environment variables: S3_ASSETS_BUCKET_NAME or AWS_REGION"
        );
        return null;
      }

      return `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${s3Key}`;
    }

    return null;
  } catch (error) {
    console.error(`Failed to convert CloudFront URL: ${cloudFrontUrl}`, error);
    return null;
  }
}

/**
 * Delete screenshot file from S3
 */
async function deleteScreenshotFromS3(
  screenshotId: string,
  screenshotUrl: string
): Promise<void> {
  try {
    console.log(
      `Deleting screenshot ${screenshotId} from S3: ${screenshotUrl}`
    );

    // Convert CloudFront URL to S3 URL if needed
    let s3Url = screenshotUrl;
    if (
      screenshotUrl.includes("cloudfront.net") ||
      screenshotUrl.includes(process.env.DOMAIN_NAME || "")
    ) {
      const convertedUrl = convertCloudFrontUrlToS3Url(screenshotUrl);
      if (convertedUrl) {
        s3Url = convertedUrl;
      } else {
        console.warn(
          `Could not convert CloudFront URL to S3 URL: ${screenshotUrl}`
        );
        return;
      }
    }

    const s3Info = parseS3Url(s3Url);
    if (!s3Info) {
      console.error(
        `Failed to parse S3 URL for screenshot ${screenshotId}: ${s3Url}`
      );
      return;
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: s3Info.bucketName,
        Key: s3Info.objectKey,
      })
    );

    console.log(`Successfully deleted screenshot ${screenshotId} from S3`);
  } catch (error) {
    console.error(
      `Failed to delete screenshot ${screenshotId} from S3:`,
      error
    );
    // Continue with other deletions even if one fails
  }
}

/**
 * Delete email files and attachments from S3
 */
async function deleteEmailFromS3(
  emailId: string,
  s3EmailUrl: string,
  attachmentUrls: string[] | null
): Promise<void> {
  try {
    console.log(`Deleting email ${emailId} from S3: ${s3EmailUrl}`);

    // Delete main email file
    const emailS3Info = parseS3Url(s3EmailUrl);
    if (emailS3Info) {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: emailS3Info.bucketName,
          Key: emailS3Info.objectKey,
        })
      );
      console.log(`Successfully deleted email file ${emailId} from S3`);
    } else {
      console.error(
        `Failed to parse email S3 URL for ${emailId}: ${s3EmailUrl}`
      );
    }

    // Delete attachments if they exist
    if (attachmentUrls && attachmentUrls.length > 0) {
      console.log(
        `Deleting ${attachmentUrls.length} attachments for email ${emailId}`
      );

      for (let i = 0; i < attachmentUrls.length; i++) {
        const attachmentUrl = attachmentUrls[i];
        if (!attachmentUrl) {
          console.warn(`Attachment URL ${i + 1} is empty for email ${emailId}`);
          continue;
        }

        try {
          const attachmentS3Info = parseS3Url(attachmentUrl);
          if (attachmentS3Info) {
            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: attachmentS3Info.bucketName,
                Key: attachmentS3Info.objectKey,
              })
            );
            console.log(
              `Successfully deleted attachment ${i + 1} for email ${emailId}`
            );
          } else {
            console.error(
              `Failed to parse attachment S3 URL for email ${emailId}: ${attachmentUrl}`
            );
          }
        } catch (attachmentError) {
          console.error(
            `Failed to delete attachment ${i + 1} for email ${emailId}:`,
            attachmentError
          );
          // Continue with other attachments
        }
      }
    }
  } catch (error) {
    console.error(`Failed to delete email ${emailId} from S3:`, error);
    // Continue with other deletions even if one fails
  }
}

/**
 * Delete all user data from database and S3
 */
async function deleteCompleteUserData(userId: string): Promise<{
  deletedFromS3: {
    screenshots: number;
    emails: number;
    attachments: number;
  };
  deletedFromDatabase: {
    twoFactorAuthentications: number;
    screenshots: number;
    codes: number;
    emails: number;
    runs: number;
    cibus2FAcodes: number;
    inbox: number;
    settings: number;
    user: number;
  };
}> {
  const result = {
    deletedFromS3: {
      screenshots: 0,
      emails: 0,
      attachments: 0,
    },
    deletedFromDatabase: {
      twoFactorAuthentications: 0,
      screenshots: 0,
      codes: 0,
      emails: 0,
      runs: 0,
      cibus2FAcodes: 0,
      inbox: 0,
      settings: 0,
      user: 0,
    },
  };

  console.log(`Starting complete deletion for user ${userId}`);

  // ============================================================================
  // STEP 1: FETCH ALL USER DATA FOR S3 CLEANUP
  // ============================================================================

  // Fetch user data
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Fetch settings hub
  const settings = await Settings.findOne({
    where: { userId },
  });

  // Fetch notification settings and 2FA records
  let twoFactorAuthentications: TwoFactorAuthentication[] = [];
  if (settings?.notificationSettingsId) {
    twoFactorAuthentications = await TwoFactorAuthentication.findAll({
      where: { notificationSettingsId: settings.notificationSettingsId },
    });
  }

  // Fetch inbox and emails
  const inbox = await Inbox.findOne({
    where: { userId },
  });

  const emails = inbox
    ? await Emails.findAll({
        where: { inboxId: inbox.id },
      })
    : [];

  // Fetch runs
  const runs = await Run.findAll({
    where: { userId },
  });

  // Fetch screenshots for all runs
  const runIds = runs.map((run) => run.id);
  const screenshots =
    runIds.length > 0
      ? await Screenshot.findAll({
          where: { runId: runIds },
        })
      : [];

  // ============================================================================
  // STEP 2: DELETE S3 FILES
  // ============================================================================

  console.log("Starting S3 cleanup...");

  // Delete screenshot files
  for (const screenshot of screenshots) {
    await deleteScreenshotFromS3(screenshot.id, screenshot.screenshotUrl);
    result.deletedFromS3.screenshots++;
  }

  // Delete email files and attachments
  for (const email of emails) {
    const attachmentCount = email.attachmentUrls
      ? email.attachmentUrls.length
      : 0;
    await deleteEmailFromS3(email.id, email.s3EmailUrl, email.attachmentUrls);
    result.deletedFromS3.emails++;
    result.deletedFromS3.attachments += attachmentCount;
  }

  console.log("S3 cleanup completed");

  // ============================================================================
  // STEP 3: DELETE DATABASE RECORDS IN CORRECT ORDER
  // ============================================================================

  console.log("Starting database cleanup...");

  // Delete TwoFactorAuthentication records first (depends on NotificationSettings)
  if (twoFactorAuthentications.length > 0 && settings?.notificationSettingsId) {
    const deletedTFA = await TwoFactorAuthentication.destroy({
      where: {
        notificationSettingsId: settings.notificationSettingsId,
      },
    });
    result.deletedFromDatabase.twoFactorAuthentications = deletedTFA;
    console.log(`Deleted ${deletedTFA} TwoFactorAuthentication records`);
  }

  // Delete Screenshots (depends on Run)
  if (screenshots.length > 0) {
    const deletedScreenshots = await Screenshot.destroy({
      where: { runId: runIds },
    });
    result.deletedFromDatabase.screenshots = deletedScreenshots;
    console.log(`Deleted ${deletedScreenshots} Screenshot records`);
  }

  // Delete Codes (can depend on both Run and Emails)
  const deletedCodes = await Code.destroy({
    where: { userId },
  });
  result.deletedFromDatabase.codes = deletedCodes;
  console.log(`Deleted ${deletedCodes} Code records`);

  // Delete Emails (depends on Inbox)
  if (emails.length > 0 && inbox) {
    const deletedEmails = await Emails.destroy({
      where: { inboxId: inbox.id },
    });
    result.deletedFromDatabase.emails = deletedEmails;
    console.log(`Deleted ${deletedEmails} Email records`);
  }

  // Delete Runs (depends on User)
  if (runs.length > 0) {
    const deletedRuns = await Run.destroy({
      where: { userId },
    });
    result.deletedFromDatabase.runs = deletedRuns;
    console.log(`Deleted ${deletedRuns} Run records`);
  }

  // Delete Cibus2FA codes (depends on User)
  const deletedCibus2FA = await Cibus2FA.destroy({
    where: { userId },
  });
  result.deletedFromDatabase.cibus2FAcodes = deletedCibus2FA;
  console.log(`Deleted ${deletedCibus2FA} Cibus2FA records`);

  // Delete Inbox (depends on User)
  if (inbox) {
    const deletedInbox = await Inbox.destroy({
      where: { userId },
    });
    result.deletedFromDatabase.inbox = deletedInbox;
    console.log(`Deleted ${deletedInbox} Inbox record`);
  }

  // Delete Settings and all connected settings tables
  if (settings) {
    // Delete individual settings tables first
    if (settings.notificationSettingsId) {
      await NotificationSettings.destroy({
        where: { id: settings.notificationSettingsId },
      });
    }
    if (settings.woltSettingsId) {
      await WoltSettings.destroy({
        where: { id: settings.woltSettingsId },
      });
    }
    if (settings.cibusSettingsId) {
      await CibusSettings.destroy({
        where: { id: settings.cibusSettingsId },
      });
    }
    if (settings.runSettingsId) {
      await RunSettings.destroy({
        where: { id: settings.runSettingsId },
      });
    }

    // Delete main settings record
    const deletedSettings = await Settings.destroy({
      where: { userId },
    });
    result.deletedFromDatabase.settings = deletedSettings;
    console.log(
      `Deleted ${deletedSettings} Settings record and related settings`
    );
  }

  // Finally, delete the User record
  const deletedUser = await User.destroy({
    where: { id: userId },
  });
  result.deletedFromDatabase.user = deletedUser;
  console.log(`Deleted ${deletedUser} User record`);

  console.log("Database cleanup completed");

  return result;
}

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event) => {
    try {
      const cognitoSub = event.userId!;

      console.log(
        `Starting complete user deletion for cognitoSub: ${cognitoSub}`
      );

      // Find user by cognitoSub
      const user = await User.findOne({
        where: { cognitoSub },
      });

      if (!user) {
        return createErrorResponse("User not found", 404);
      }

      const userId = user.id;

      // Delete all user data from database and S3
      const deletionResult = await deleteCompleteUserData(userId);

      console.log("User deletion completed successfully:", deletionResult);

      // Return success response with deletion summary
      return createSuccessResponse("User account deleted successfully", {
        summary: deletionResult,
        message:
          "All user data has been permanently deleted from the database and cloud storage",
      });
    } catch (error) {
      console.error("Error in user deletion:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
