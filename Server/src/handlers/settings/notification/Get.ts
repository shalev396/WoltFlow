import { Settings, NotificationSettings } from "../../../models/index.js";
import { authMiddleware } from "../../../middlewares/auth.js";
import { CustomAPIGatewayProxyHandler } from "../../../typescript/types/aws.js";
import { ICustomAPIGatewayProxyEventAuth } from "../../../typescript/interfaces/aws.js";
import sequelize from "../../../config/database.js";
import { syncDatabase } from "../../../config/bootstrap.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../../utils/responseUtil.js";

// Connect to database
await sequelize.authenticate();
await syncDatabase();
export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
    try {
      // Find settings with notification settings included
      const settings = await Settings.findOne({
        where: { userId: event.userId! },
        include: [
          {
            model: NotificationSettings,
            as: "notificationSettings",
            required: false,
          },
        ],
      });

      if (!settings) {
        return createSuccessResponse(
          "Notification settings retrieved successfully",
          {
            notificationSettings: null,
          }
        );
      }

      const notificationSettings = (settings as any).notificationSettings;

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
