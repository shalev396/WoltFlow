import { type CustomAPIGatewayProxyHandler } from "../../types/index.js";
import { type CompleteUserExport } from "../../types/sequelize.js";
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
import {
  createUserExportZip,
  generateExportFilename,
} from "../../utils/exportUtil.js";
import { uploadZipToS3AndGetDownloadUrl } from "../../utils/s3Util.js";

// Connect to database
await initDB();

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event) => {
    try {
      const userId = event.userId!;

      // Fetch user data
      const user = await User.findByPk(userId, {});

      if (!user) {
        return createErrorResponse("User not found", 404);
      }

      // Fetch settings hub
      const settings = await Settings.findOne({
        where: { userId },
      });

      // Fetch all connected settings
      let notificationSettings = null;
      let woltSettings = null;
      let cibusSettings = null;
      let runSettings = null;
      let twoFactorAuthentications: TwoFactorAuthentication[] = [];

      if (settings) {
        if (settings.notificationSettingsId) {
          notificationSettings = await NotificationSettings.findByPk(
            settings.notificationSettingsId
          );

          // Fetch 2FA records connected to notification settings
          if (notificationSettings) {
            twoFactorAuthentications = await TwoFactorAuthentication.findAll({
              where: { notificationSettingsId: notificationSettings.id },
            });
          }
        }

        if (settings.woltSettingsId) {
          woltSettings = await WoltSettings.findByPk(
            settings.woltSettingsId,
            {}
          );
        }

        if (settings.cibusSettingsId) {
          cibusSettings = await CibusSettings.findByPk(
            settings.cibusSettingsId
          );
        }

        if (settings.runSettingsId) {
          runSettings = await RunSettings.findByPk(settings.runSettingsId, {});
        }
      }

      // Fetch inbox and emails
      const inbox = await Inbox.findOne({
        where: { userId },
        attributes: ["id", "userId", "emailAddress", "createdAt", "updatedAt"],
      });

      const emails = inbox
        ? await Emails.findAll({
            where: { inboxId: inbox.id },
          })
        : [];

      // Fetch runs and related data
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

      // Fetch all codes belonging to user
      const codes = await Code.findAll({
        where: { userId },
      });

      // Fetch Cibus 2FA codes
      const cibus2FAcodes = await Cibus2FA.findAll({
        where: { userId },
      });

      // Prepare complete export data
      const exportData: CompleteUserExport = {
        user: user.toJSON(),
        settings: settings ? settings.toJSON() : null,
        notificationSettings: notificationSettings
          ? notificationSettings.toJSON()
          : null,
        woltSettings: woltSettings ? woltSettings.toJSON() : null,
        cibusSettings: cibusSettings ? cibusSettings.toJSON() : null,
        runSettings: runSettings ? runSettings.toJSON() : null,
        twoFactorAuthentications: twoFactorAuthentications.map((tfa) =>
          tfa.toJSON()
        ),
        inbox: inbox ? inbox.toJSON() : null,
        emails: emails.map((email) => email.toJSON()),
        runs: runs.map((run) => run.toJSON()),
        screenshots: screenshots.map((screenshot) => screenshot.toJSON()),
        codes: codes.map((code) => code.toJSON()),
        cibus2FAcodes: cibus2FAcodes.map((code) => code.toJSON()),
      };

      // Create ZIP file with CSV and all files
      console.log("Creating ZIP export for user:", userId);
      const zipBuffer = await createUserExportZip(exportData);
      const filename = generateExportFilename(user.email);

      console.log(
        `ZIP export created: ${filename}, size: ${zipBuffer.length} bytes`
      );

      // Upload ZIP to S3 and get download URL instead of returning binary data
      console.log("Uploading ZIP to S3 and generating download URL...");
      const { downloadUrl } = await uploadZipToS3AndGetDownloadUrl(
        zipBuffer,
        filename
      );

      console.log("ZIP uploaded successfully, returning download URL");

      // Return JSON response with download URL
      return createSuccessResponse("Export completed successfully", {
        downloadUrl,
        filename,
        size: zipBuffer.length,
        expiresIn: "24 hours",
      });
    } catch (error) {
      console.error("Error in user data export:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
