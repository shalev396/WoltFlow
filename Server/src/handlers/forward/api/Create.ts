import { CustomAPIGatewayProxyHandler } from "../../../typescript/types/aws.js";
import sequelize from "../../../config/database.js";
import { User } from "../../../models/index.js";
import { authMiddleware } from "../../../middlewares/auth.js";
import { randomBytes } from "crypto";
import { ICustomAPIGatewayProxyEventAuth } from "../../../typescript/interfaces/aws.js";
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
