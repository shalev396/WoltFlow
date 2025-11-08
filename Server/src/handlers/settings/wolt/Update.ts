import { Settings, WoltSettings } from "../../../models/index.js";
import { authMiddleware } from "../../../middlewares/auth.js";
import {
  type SettingsWithWoltSettings,
  type CustomAPIGatewayProxyHandler,
  type ICustomAPIGatewayProxyEventAuth,
} from "../../../types/index.js";
import { initDB } from "../../../config/bootstrap.js";
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
await initDB();

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
    try {
      // Parse request body
      if (!event.body) {
        return createErrorResponse("Request body is required", 400);
      }

      const requestData: SaveWoltSettingsRequest = JSON.parse(event.body);

      // Find or create main settings record with wolt settings included
      const [settings] = (await Settings.findOrCreate({
        where: { userId: event.userId! },
        defaults: { userId: event.userId! },
        include: [
          {
            model: WoltSettings,
            as: "woltSettings",
            required: false,
          },
        ],
      })) as [SettingsWithWoltSettings, boolean];

      // Get or create wolt settings
      let woltSettings: WoltSettings;

      if (settings.woltSettings) {
        woltSettings = settings.woltSettings;
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

      return createSuccessResponse("Wolt settings updated successfully", {
        woltSettings: woltSettings,
      });
    } catch (error) {
      console.error("Error in saveWoltSettings handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
