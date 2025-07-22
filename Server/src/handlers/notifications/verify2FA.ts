import { Op } from "sequelize";
import TwoFA from "../../models/TwoFA.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
import { ICustomAPIGatewayProxyEvent } from "../../typescript/interfaces/aws.js";
import sequelize from "../../config/database.js";

interface Verify2FARequest {
  method: "sms" | "email";
  code: string;
  sessionId?: string;
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

      const { method, code, sessionId }: Verify2FARequest = JSON.parse(
        event.body
      );

      // Validate input
      if (!method || !code) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            message: "Method and code are required",
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

      // Validate code format (6 digits)
      if (!/^\d{6}$/.test(code)) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            message: "Code must be 6 digits",
          }),
        };
      }

      // Build where clause for finding the verification record
      const whereClause: any = {
        userId: event.userId!,
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
      const verificationRecord = await TwoFA.findOne({
        where: whereClause,
        order: [["createdAt", "DESC"]], // Get the most recent match
      });

      if (!verificationRecord) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            message: "Invalid or expired verification code",
          }),
        };
      }

      // Mark as verified
      verificationRecord.verified = true;
      await verificationRecord.save();

      console.log(
        `Verification code verified for user ${event.userId}, method: ${method}, contact: ${verificationRecord.contact}`
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Verification successful",
          contact: verificationRecord.contact,
        }),
      };
    } catch (error) {
      console.error("Error in verify2FA handler:", error);
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
