import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws";
import sequelize from "../../config/database";
import User from "../../models/User";
import { authMiddleware } from "../../middlewares/auth";
import { randomBytes } from "crypto";

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event) => {
    try {
      await sequelize.authenticate();

      // Generate a unique API key
      const apiKey = randomBytes(32).toString("hex");

      // Find the user and update their API key
      const user = await User.findByPk(event.userId);

      if (!user) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "User not found" }),
        };
      }

      // Update the user's API key
      await user.update({ apiKey });

      return {
        statusCode: 200,
        body: JSON.stringify({
          apiKey,
          message: "API key generated successfully",
        }),
      };
    } catch (error) {
      console.error("Generate API key error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      };
    }
  }
);
