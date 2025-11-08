import { type InferAttributes, Op, type WhereOptions } from "sequelize";
import {
  TwoFactorAuthentication,
  Settings,
  NotificationSettings,
} from "../../../../models/index.js";
import { authMiddleware } from "../../../../middlewares/auth.js";
import {
  type SettingsWithNotificationSettings,
  type CustomAPIGatewayProxyHandler,
  type ICustomAPIGatewayProxyEventAuth,
} from "../../../../types/index.js";
import { initDB } from "../../../../config/bootstrap.js";

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
await initDB();

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
      const settings = (await Settings.findOne({
        where: { userId: event.userId! },
        include: [
          {
            model: NotificationSettings,
            as: "notificationSettings",
          },
        ],
      })) as SettingsWithNotificationSettings;

      const notificationSettings = settings
        ? settings.notificationSettings
        : null;

      if (!settings || !notificationSettings) {
        return createErrorResponse("User notification settings not found", 404);
      }

      // 1) Derive attribute type from the Sequelize model:
      type TFAAttrs = InferAttributes<TwoFactorAuthentication>;

      // ... inside your handler, after you’ve loaded `settings` & `notificationSettings` and validated inputs:

      // 2) Build the where object ONCE (immutable) with conditional spreads.
      //    - It is fully typed as WhereOptions<TFAAttrs>.
      //    - `id` is only added when `sessionId` exists, so no post-hoc mutation.
      //    - NOTE: We cannot filter by 'code' in the WHERE clause because codes are encrypted
      const whereClause: WhereOptions<TFAAttrs> = {
        notificationSettingsId: notificationSettings.id,
        method, // should match union on your model attribute, e.g. "sms" | "email"
        // code removed - we'll check it manually after decryption
        verified: false, // boolean
        expiresAt: { [Op.gte]: new Date() }, // operator is fine on date columns

        // Conditionally add { id: sessionId }
        ...(sessionId ? { id: sessionId } : {}),
      } satisfies WhereOptions<TFAAttrs>; // validates shape w/out changing the inferred literal type

      // Find all potential verification records (without code filter since codes are encrypted)
      const verificationRecords = await TwoFactorAuthentication.findAll({
        where: whereClause,
        order: [["createdAt", "DESC"]], // Get the most recent matches first
      });

      // Find the record with matching decrypted code
      let verificationRecord: TwoFactorAuthentication | null = null;
      for (const record of verificationRecords) {
        if (record.code === code) {
          // This will use the getter which decrypts
          verificationRecord = record;
          break;
        }
      }

      if (!verificationRecord) {
        console.log(
          `Verification failed for user ${event.userId}: Found ${verificationRecords.length} potential records, but none matched the provided code`
        );
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
