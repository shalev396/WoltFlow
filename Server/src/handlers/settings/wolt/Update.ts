import { Settings, WoltSettings } from "../../../models/index.js";
import { authMiddleware } from "../../../middlewares/auth.js";
import { CustomAPIGatewayProxyHandler } from "../../../typescript/types/aws.js";
import { ICustomAPIGatewayProxyEventAuth } from "../../../typescript/interfaces/aws.js";
import sequelize from "../../../config/database.js";
import { syncDatabase } from "../../../config/bootstrap.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../../utils/responseUtil.js";

interface SaveWoltSettingsRequest {
  woltRefreshToken?: string | null;
  woltAccessToken?: string | null;
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

      const requestData: SaveWoltSettingsRequest = JSON.parse(event.body);

      // Find or create main settings record with wolt settings included
      let [settings] = await Settings.findOrCreate({
        where: { userId: event.userId! },
        defaults: { userId: event.userId! },
        include: [
          {
            model: WoltSettings,
            as: "woltSettings",
            required: false,
          },
        ],
      });

      // Get or create wolt settings
      let woltSettings: WoltSettings;

      if ((settings as any).woltSettings) {
        woltSettings = (settings as any).woltSettings;
      } else {
        // Create new wolt settings
        woltSettings = await WoltSettings.create({
          woltRefreshToken: null,
          woltAccessToken: null,
        });

        // Link it to the settings
        await settings.update({
          woltSettingsId: woltSettings.id,
        });
      }

      // Update wolt settings fields
      const updates: Partial<typeof requestData> = {};

      if (requestData.woltRefreshToken !== undefined) {
        updates.woltRefreshToken = requestData.woltRefreshToken;
      }
      if (requestData.woltAccessToken !== undefined) {
        updates.woltAccessToken = requestData.woltAccessToken;
      }

      // Apply updates
      await woltSettings.update(updates);

      // Reload wolt settings to get the updated values
      await woltSettings.reload();

      console.log(`Wolt settings updated for user ${event.userId}:`, {
        hasRefreshToken: !!woltSettings.woltRefreshToken,
        hasAccessToken: !!woltSettings.woltAccessToken,
        // Don't log actual tokens for security
      });

      return createSuccessResponse("Wolt settings updated successfully", {
        woltSettings: woltSettings,
      });
    } catch (error) {
      console.error("Error in saveWoltSettings handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
