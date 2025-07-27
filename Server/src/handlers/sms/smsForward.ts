import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import sequelize from "../../config/database.js";
import User from "../../models/User.js";
import Setting from "../../models/Setting.js";
import { syncDatabase } from "../../config/bootstrap.js";

// Connect to database
await sequelize.authenticate();
await syncDatabase();
export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
  try {
    // Get API key from headers
    const apiKey = event.headers["x-api-key"] || event.headers["X-API-Key"];

    if (!apiKey) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "API key required" }),
      };
    }

    // Find user by API key
    const user = await User.findOne({
      where: { apiKey },
    });

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid API key" }),
      };
    }

    // Get user settings
    const settings = await Setting.findOne({
      where: { userId: user.userId },
    });

    if (!settings) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User settings not found" }),
      };
    }

    // Parse the request body
    const requestBody = event.body ? JSON.parse(event.body) : {};
    const message = requestBody.message || "";

    // Log the request body
    console.log(
      "SMS Forward Request Body:",
      JSON.stringify(requestBody, null, 2)
    );

    // Extract 6-digit code from the message
    // Looking for pattern like "355650" in the message
    const codeMatch = message.match(/\b\d{6}\b/);

    if (codeMatch) {
      const code = codeMatch[0];

      // Update settings with the 2FA code
      await settings.update({ cibus2FAcode: code });

      console.log(`2FA code ${code} saved for user ${user.userId}`);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "2FA code saved successfully",
          code: code,
        }),
      };
    } else {
      // No code found, just log the message
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "SMS received but no 6-digit code found",
          data: requestBody,
        }),
      };
    }
  } catch (error) {
    console.error("SMS Forward error:", error);
    return {
      statusCode: 500,

      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
