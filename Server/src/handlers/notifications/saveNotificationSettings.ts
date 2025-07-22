import Setting from "../../models/Setting.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
import { ICustomAPIGatewayProxyEvent } from "../../typescript/interfaces/aws.js";
import sequelize from "../../config/database.js";

interface SaveNotificationSettingsRequest {
  notificationMethod?: "sms" | "email" | null;
  phoneNumber?: string | null;
  phoneVerified?: boolean;
  email?: string | null;
  emailVerified?: boolean;
}

// Connect to database
await sequelize.authenticate();

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEvent) => {
    try {
      // Parse request body
      if (!event.body) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            message: "Request body is required",
          }),
        };
      }

      const requestData: SaveNotificationSettingsRequest = JSON.parse(
        event.body
      );

      // Find existing settings
      let settings = await Setting.findOne({
        where: { userId: event.userId! },
      });

      if (!settings) {
        // Create new settings if they don't exist
        settings = await Setting.create({
          userId: event.userId!,
          isNotification: false,
          hasGmailAccess: false,
          automationEnabled: false,
          automationMode: "full-run",
          phoneVerified: false,
          emailVerified: false,
        });
      }

      // Update notification method if provided
      if (requestData.notificationMethod !== undefined) {
        settings.notificationMethod = requestData.notificationMethod;
      }

      // Update phone number and verification status
      if (requestData.phoneNumber !== undefined) {
        settings.phoneNumber = requestData.phoneNumber;
      }
      if (requestData.phoneVerified !== undefined) {
        settings.phoneVerified = requestData.phoneVerified;
      }

      // Update email and verification status
      if (requestData.email !== undefined) {
        settings.email = requestData.email;
      }
      if (requestData.emailVerified !== undefined) {
        settings.emailVerified = requestData.emailVerified;
      }

      // Save the updated settings
      await settings.save();

      console.log(`Notification settings updated for user ${event.userId}:`, {
        notificationMethod: settings.notificationMethod,
        phoneNumber: settings.phoneNumber,
        phoneVerified: settings.phoneVerified,
        email: settings.email,
        emailVerified: settings.emailVerified,
      });

      return {
        statusCode: 200,
        body: JSON.stringify(settings),
      };
    } catch (error) {
      console.error("Error in saveNotificationSettings handler:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: "Internal server error",
        }),
      };
    }
  }
);
