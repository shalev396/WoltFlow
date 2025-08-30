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

// Connect to database
await initDB();

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
    try {
      // Find settings with notification settings included
      const settings = (await Settings.findOne({
        where: { userId: event.userId! },
        include: [
          {
            model: NotificationSettings,
            as: "notificationSettings",
            required: false,
          },
        ],
      })) as SettingsWithNotificationSettings;

      if (!settings) {
        return createSuccessResponse(
          "Notification settings retrieved successfully",
          {
            notificationSettings: null,
          }
        );
      }

      const notificationSettings = settings.notificationSettings;

      return createSuccessResponse(
        "Notification settings retrieved successfully",
        {
          notificationSettings: notificationSettings || null,
        }
      );
    } catch (error) {
      console.error("Error in getNotificationSettings handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
