import { Settings, NotificationSettings } from "../../../models/index.js";
import { authMiddleware } from "../../../middlewares/auth.js";
import {
  type SettingsWithNotificationSettings,
  type CustomAPIGatewayProxyHandler,
  type ICustomAPIGatewayProxyEventAuth,
} from "../../../types/index.js";
import { initDB } from "../../../config/bootstrap.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../../utils/responseUtil.js";

interface SaveNotificationSettingsRequest {
  notificationMethod?: "sms" | "email" | null;
  notificationOnSuccess?: boolean;
  notificationOnError?: boolean;
  phoneNumber?: string | null;
  phoneVerified?: boolean;
  email?: string | null;
  emailVerified?: boolean;
  isEnabled?: boolean;
}

// Connect to database
await initDB();
export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
    try {
      // Parse request body
      if (!event.body) {
        return createErrorResponse("Request body is required", 400);
      }

      const requestData: SaveNotificationSettingsRequest = JSON.parse(
        event.body
      );

      // Find or create main settings record with notification settings included
      let [settings] = (await Settings.findOrCreate({
        where: { userId: event.userId! },
        defaults: { userId: event.userId! },
        include: [
          {
            model: NotificationSettings,
            as: "notificationSettings",
            required: false,
          },
        ],
      })) as [SettingsWithNotificationSettings, boolean];

      // Get or create notification settings
      let notificationSettings: NotificationSettings;

      if (settings.notificationSettings) {
        notificationSettings = settings.notificationSettings;
      } else {
        // Create new notification settings
        notificationSettings = await NotificationSettings.create({
          isEnabled: false,
          notificationOnSuccess: false,
          notificationOnError: false,
          phoneVerified: false,
          emailVerified: false,
        });

        // Link it to the settings
        await settings.update({
          notificationSettingsId: notificationSettings.id,
        });
      }

      // Update notification settings fields
      const updates: Partial<typeof requestData> = {};

      if (requestData.isEnabled !== undefined) {
        updates.isEnabled = requestData.isEnabled;
      }
      if (requestData.notificationMethod !== undefined) {
        updates.notificationMethod = requestData.notificationMethod;
      }
      if (requestData.notificationOnSuccess !== undefined) {
        updates.notificationOnSuccess = requestData.notificationOnSuccess;
      }
      if (requestData.notificationOnError !== undefined) {
        updates.notificationOnError = requestData.notificationOnError;
      }
      if (requestData.phoneNumber !== undefined) {
        // Convert empty string to null
        updates.phoneNumber =
          requestData.phoneNumber === "" ? null : requestData.phoneNumber;
      }
      if (requestData.phoneVerified !== undefined) {
        updates.phoneVerified = requestData.phoneVerified;
      }
      if (requestData.email !== undefined) {
        // Convert empty string to null
        updates.email = requestData.email === "" ? null : requestData.email;
      }
      if (requestData.emailVerified !== undefined) {
        updates.emailVerified = requestData.emailVerified;
      }

      // Apply updates
      await notificationSettings.update(updates);

      // Reload notification settings to get the updated values
      await notificationSettings.reload();

      return createSuccessResponse(
        "Notification settings updated successfully",
        {
          notificationSettings: notificationSettings,
        }
      );
    } catch (error) {
      console.error("Error in saveNotificationSettings handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
