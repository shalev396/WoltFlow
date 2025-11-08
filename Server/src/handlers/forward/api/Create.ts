import { randomBytes } from "crypto";
import { type CustomAPIGatewayProxyHandler } from "../../../types/aws.js";
import { User } from "../../../models/index.js";
import { authMiddleware } from "../../../middlewares/auth.js";
import { type ICustomAPIGatewayProxyEventAuth } from "../../../types/aws.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../../utils/responseUtil.js";
import { initDB } from "../../../config/bootstrap.js";

// Connect to database
await initDB();

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
    try {
      // Generate a unique API key
      const apiKey = randomBytes(32).toString("hex");

      // Find the user by internal UUID and update their API key
      const user = await User.findByPk(event.userId);

      if (!user) {
        return createErrorResponse("User not found", 404);
      }

      // Update the user's API key
      await user.update({ apiKey });

      return createSuccessResponse("API key generated successfully", {
        apiKey,
      });
    } catch (error) {
      console.error("Generate API key error:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
