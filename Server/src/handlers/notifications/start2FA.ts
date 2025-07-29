import { Op } from "sequelize";
import TwoFA from "../../models/TwoFA.js";
import { sendSmsBySenderID, formatPhoneNumber } from "../../utils/smsUtil.js";
import { sendEmail, normalizeEmail } from "../../utils/emailUtil.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
import { ICustomAPIGatewayProxyEventAuth } from "../../typescript/interfaces/aws.js";
import sequelize from "../../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { syncDatabase } from "../../config/bootstrap.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Start2FARequest {
  method: "sms" | "email";
  contact: string;
}

// Connect to database
await sequelize.authenticate();
await syncDatabase();
export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
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

      const { method, contact }: Start2FARequest = JSON.parse(event.body);

      // Validate input
      if (!method || !contact) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            message: "Method and contact are required",
          }),
        };
      }

      if (!["sms", "email"].includes(method)) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            message: "Method must be 'sms' or 'email'",
          }),
        };
      }

      // Validate and format contact
      let formattedContact: string;
      if (method === "sms") {
        const formatted = formatPhoneNumber(contact);
        if (!formatted) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              success: false,
              message: "Invalid phone number format",
            }),
          };
        }
        formattedContact = formatted;
      } else {
        const normalized = normalizeEmail(contact);
        if (!normalized) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              success: false,
              message: "Invalid email address format",
            }),
          };
        }
        formattedContact = normalized;
      }

      // Check rate limiting - allow one request per 30 seconds per user+method
      const recentCode = await TwoFA.findOne({
        where: {
          userId: event.userId!,
          method,
          createdAt: {
            [Op.gte]: new Date(Date.now() - 30000), // 30 seconds ago
          },
        },
        order: [["createdAt", "DESC"]],
      });

      if (recentCode) {
        return {
          statusCode: 429,
          body: JSON.stringify({
            success: false,
            message: "Please wait 30 seconds before requesting another code",
          }),
        };
      }

      // Invalidate previous unverified codes for this user+method
      await TwoFA.update(
        { verified: true }, // Mark as verified to "invalidate" them
        {
          where: {
            userId: event.userId!,
            method,
            verified: false,
          },
        }
      );

      // Generate 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Set expiration time (5 minutes from now)
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      // Create verification record
      const verificationRecord = await TwoFA.create({
        userId: event.userId!,
        method,
        contact: formattedContact,
        code,
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
            return {
              statusCode: 500,
              body: JSON.stringify({
                success: false,
                message: "Failed to send SMS verification code",
              }),
            };
          }
        } else {
          // Send email using template
          const templatePath = path.join(
            __dirname,
            "../../../templates/2FA/index.html"
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
            return {
              statusCode: 500,
              body: JSON.stringify({
                success: false,
                message: "Failed to send email verification code",
              }),
            };
          }
        }

        console.log(
          `Verification code sent via ${method} to ${formattedContact} for user ${event.userId}`
        );

        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: `Verification code sent via ${method}`,
            sessionId: verificationRecord.id,
          }),
        };
      } catch (sendError) {
        console.error(`Failed to send ${method} verification:`, sendError);
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            message: `Failed to send ${method} verification code`,
          }),
        };
      }
    } catch (error) {
      console.error("Error in start2FA handler:", error);
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
