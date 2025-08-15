import { Op } from "sequelize";
import {
  TwoFactorAuthentication,
  Settings,
  NotificationSettings,
} from "../../../../models/index.js";
import {
  sendSmsBySenderID,
  formatPhoneNumber,
} from "../../../../utils/smsUtil.js";
import { sendEmail, normalizeEmail } from "../../../../utils/emailUtil.js";
import { authMiddleware } from "../../../../middlewares/auth.js";
import { CustomAPIGatewayProxyHandler } from "../../../../typescript/types/aws.js";
import { ICustomAPIGatewayProxyEventAuth } from "../../../../typescript/interfaces/aws.js";
import sequelize from "../../../../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { syncDatabase } from "../../../../config/bootstrap.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Start2FARequest {
  method: "sms" | "email";
  contact: string;
}

import {
  createSuccessResponse,
  createErrorResponse,
} from "../../../../utils/responseUtil.js";

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

      const { method, contact }: Start2FARequest = JSON.parse(event.body);

      // Validate input
      if (!method || !contact) {
        return createErrorResponse("Method and contact are required", 400);
      }

      if (!["sms", "email"].includes(method)) {
        return createErrorResponse("Method must be 'sms' or 'email'", 400);
      }

      // Check if SMS is enabled via environment variable
      if (method === "sms") {
        const enabledSMS = process.env["enabledSMS"]?.toLowerCase() === "true";
        if (!enabledSMS) {
          console.log(
            `SMS 2FA was not allowed because SMS is disabled via environment variable (enabledSMS=${process.env["enabledSMS"]})`
          );
          return createErrorResponse(
            "SMS functionality is currently disabled",
            400
          );
        }
      }

      // Validate and format contact
      let formattedContact: string;
      if (method === "sms") {
        const formatted = formatPhoneNumber(contact);
        if (!formatted) {
          return createErrorResponse("Invalid phone number format", 400);
        }
        formattedContact = formatted;
      } else {
        const normalized = normalizeEmail(contact);
        if (!normalized) {
          return createErrorResponse("Invalid email address format", 400);
        }
        formattedContact = normalized;
      }

      // Find user's notification settings
      const settings = await Settings.findOne({
        where: { userId: event.userId! },
        include: [
          {
            model: NotificationSettings,
            as: "notificationSettings",
          },
        ],
      });

      if (!settings) {
        return createErrorResponse(
          "User settings not found. Please set up your notification preferences first.",
          404
        );
      }

      const notificationSettings = (settings as any).notificationSettings;

      if (!notificationSettings) {
        return createErrorResponse(
          "Notification settings not found. Please set up your notification preferences first.",
          404
        );
      }

      const notificationSettingsId = notificationSettings.id;

      // Check rate limiting - allow one request per 30 seconds per notification settings + method
      const recentCode = await TwoFactorAuthentication.findOne({
        where: {
          notificationSettingsId,
          method,
          createdAt: {
            [Op.gte]: new Date(Date.now() - 30000), // 30 seconds ago
          },
        },
        order: [["createdAt", "DESC"]],
      });

      if (recentCode) {
        return createErrorResponse(
          "Please wait 30 seconds before requesting another code",
          429
        );
      }

      // Invalidate previous unverified codes for this notification settings + method
      await TwoFactorAuthentication.destroy({
        where: {
          notificationSettingsId,
          method,
          verified: false,
        },
      });

      // Generate 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Set expiration time (5 minutes from now)
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      // Create verification record
      const verificationRecord = await TwoFactorAuthentication.create({
        notificationSettingsId,
        method,
        contact: formattedContact,
        code,
        purpose: method === "sms" ? "phone_verification" : "email_verification",
        expiresAt,
        verified: false,
      });

      // Send verification code
      try {
        if (method === "sms") {
          const result = await sendSmsBySenderID({
            phoneNumber: formattedContact,
            message: `Your WoltFlow verification code is: ${code}. This code expires in 5 minutes. Never share this code with anyone.`,
            senderID: "WoltFlow",
            smsType: "Transactional",
          });

          if (!result.success) {
            console.error("Failed to send SMS:", result.error);
            return createErrorResponse("Failed to send SMS verification code");
          }
        } else {
          // Send email using template
          const templatePath = path.join(
            __dirname,
            "../../../../../templates/2FA/index.html"
          );
          let emailTemplate = fs.readFileSync(templatePath, "utf8");

          // Replace placeholders
          emailTemplate = emailTemplate
            .replace(/{{VERIFICATION_CODE}}/g, code)
            .replace(/{{METHOD_DISPLAY}}/g, "email address");

          const result = await sendEmail({
            to: formattedContact,
            subject: "WoltFlow - Verification Code",
            htmlBody: emailTemplate,
            textBody: `Your WoltFlow verification code is: ${code}. This code expires in 5 minutes. Never share this code with anyone.`,
          });

          if (!result.success) {
            console.error("Failed to send email:", result.error);
            return createErrorResponse(
              "Failed to send email verification code"
            );
          }
        }

        console.log(
          `Verification code sent via ${method} to ${formattedContact} for user ${event.userId}`
        );

        return createSuccessResponse(`Verification code sent via ${method}`, {
          sessionId: verificationRecord.id,
        });
      } catch (sendError) {
        console.error(`Failed to send ${method} verification:`, sendError);
        return createErrorResponse(
          `Failed to send ${method} verification code`
        );
      }
    } catch (error) {
      console.error("Error in start2FA handler:", error);
      return createErrorResponse("Internal server error");
    }
  }
);
