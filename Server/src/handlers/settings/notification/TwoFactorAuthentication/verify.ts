import { Op } from "sequelize";
import {
  TwoFactorAuthentication,
  Settings,
  NotificationSettings,
} from "../../../../models/index.js";
import { authMiddleware } from "../../../../middlewares/auth.js";
import { CustomAPIGatewayProxyHandler } from "../../../../typescript/types/aws.js";
import { ICustomAPIGatewayProxyEventAuth } from "../../../../typescript/interfaces/aws.js";
import sequelize from "../../../../config/database.js";
import { syncDatabase } from "../../../../config/bootstrap.js";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../../../utils/responseUtil.js";

interface Verify2FARequest {
  method: "sms" | "email";
  code: string;
  sessionId?: string;
}

// Connect to database
await sequelize.authenticate();
await syncDatabase();
export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
    try {
      // Parse request body
      if (!event.body) {
        return createErrorResponse("Request body is required", 400);
      }

      const { method, code, sessionId }: Verify2FARequest = JSON.parse(
        event.body
      );

      // Validate input
      if (!method || !code) {
        return createErrorResponse("Method and code are required", 400);
      }

      if (!["sms", "email"].includes(method)) {
        return createErrorResponse("Method must be 'sms' or 'email'", 400);
      }

      // Validate code format (6 digits)
      if (!/^\d{6}$/.test(code)) {
        return createErrorResponse("Code must be 6 digits", 400);
      }

      // Find user's notification settings first
      const settings = await Settings.findOne({
        where: { userId: event.userId! },
        include: [
          {
            model: NotificationSettings,
            as: "notificationSettings",
          },
        ],
      });

      const notificationSettings = settings
        ? (settings as any).notificationSettings
        : null;

      if (!settings || !notificationSettings) {
        return createErrorResponse("User notification settings not found", 404);
      }

      // Build where clause for finding the verification record - using any for dynamic query building
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereClause: any = {
        notificationSettingsId: notificationSettings.id,
        method,
        code,
        verified: false,
        expiresAt: {
          [Op.gte]: new Date(), // Not expired
        },
      };

      // If sessionId provided, include it in the search
      if (sessionId) {
        whereClause.id = sessionId;
      }

      // Find the verification record
      const verificationRecord = await TwoFactorAuthentication.findOne({
        where: whereClause,
        order: [["createdAt", "DESC"]], // Get the most recent match
      });

      if (!verificationRecord) {
        return createErrorResponse("Invalid or expired verification code", 400);
      }

      // Mark as verified
      verificationRecord.verified = true;
      await verificationRecord.save();

      console.log(
        `Verification code verified for user ${event.userId}, method: ${method}, contact: ${verificationRecord.contact}`
      );

      return createSuccessResponse("Verification successful", {
        contact: verificationRecord.contact,
      });
    } catch (error) {
      console.error("Error in verify2FA handler:", error);
      return createErrorResponse("Internal server error");
    }
  }
);
