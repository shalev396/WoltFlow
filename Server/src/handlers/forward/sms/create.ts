import { User, Cibus2FA } from "../../../models/index.js";
import { type CustomAPIGatewayProxyHandler } from "../../../types/aws.js";

import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../../utils/responseUtil.js";
import { initDB } from "../../../config/bootstrap.js";

// Connect to database
await initDB();

export const handler: CustomAPIGatewayProxyHandler = async (event) => {
  try {
    // Validate API key
    const apiKey = event.headers?.["x-api-key"] || event.headers?.["X-API-Key"];
    if (!apiKey) {
      return createErrorResponse("API key is required", 401);
    }

    // Find user by API key
    const user = await User.findOne({
      where: { apiKey },
    });

    if (!user) {
      return createErrorResponse("Invalid API key", 401);
    }

    console.log(`SMS forwarding request from user ${user.id}`);

    // Parse the request body
    const requestBody = event.body ? JSON.parse(event.body) : {};
    const message = requestBody.message || "";
    const phoneNumber = requestBody.phoneNumber || requestBody.from || null;

    console.log("SMS received:", { message, phoneNumber, userId: user.id });

    // Extract 6-digit code from the message
    const codeMatch = message.match(/\b\d{6}\b/);

    if (codeMatch) {
      const code = codeMatch[0];
      const receivedAt = new Date();
      const expiresAt = new Date(receivedAt.getTime() + 10 * 60 * 1000); // 10 minutes expiration

      try {
        await Cibus2FA.create({
          userId: user.id,
          code: code,
          message: message,
          receivedAt: receivedAt,
          expiresAt: expiresAt,
          isUsed: false,
        });

        console.log(`Cibus 2FA code ${code} saved for user ${user.id}`);

        return createSuccessResponse(
          "2FA code extracted and saved successfully",
          {
            code: code,
            userId: user.id,
          }
        );
      } catch (error) {
        console.error("Error saving Cibus 2FA code:", error);
        return createErrorResponse(getErrorMessage(error));
      }
    } else {
      // No code found, just log the message for debugging
      console.log(
        `SMS received from user ${user.id} but no 6-digit code found:`,
        message
      );

      return createSuccessResponse("SMS received but no 6-digit code found", {
        originalMessage: message,
      });
    }
  } catch (error) {
    console.error("Error in smsForward handler:", error);
    return createErrorResponse(getErrorMessage(error));
  }
};
