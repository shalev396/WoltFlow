import { Settings, RunSettings } from "../../../models/index.js";
import { authMiddleware } from "../../../middlewares/auth.js";
import {
  type SettingsWithRunSettings,
  type CustomAPIGatewayProxyHandler,
  type ICustomAPIGatewayProxyEventAuth,
} from "../../../types/index.js";
import { initDB } from "../../../config/bootstrap.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../../utils/responseUtil.js";

interface SaveRunSettingsRequest {
  automationEnabled?: boolean;
  automationMode?: "full-run" | "buy-only" | "cross-account";
  giftAmount?: number | null;
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

      const requestData: SaveRunSettingsRequest = JSON.parse(event.body);

      // Find or create main settings record with run settings included
      const [settings] = (await Settings.findOrCreate({
        where: { userId: event.userId! },
        defaults: { userId: event.userId! },
        include: [
          {
            model: RunSettings,
            as: "runSettings",
            required: false,
          },
        ],
      })) as [SettingsWithRunSettings, boolean];

      // Get or create run settings
      let runSettings: RunSettings;

      if (settings.runSettings) {
        runSettings = settings.runSettings;
      } else {
        // Create new run settings
        runSettings = await RunSettings.create({
          automationEnabled: false,
          automationMode: "full-run",
          giftAmount: null,
        });

        // Link it to the settings
        await settings.update({
          runSettingsId: runSettings.id,
        });
      }

      // Update run settings fields
      const updates: Partial<typeof requestData> = {};

      if (requestData.automationEnabled !== undefined) {
        updates.automationEnabled = requestData.automationEnabled;
      }
      if (requestData.automationMode !== undefined) {
        updates.automationMode = requestData.automationMode;
      }
      if (requestData.giftAmount !== undefined) {
        updates.giftAmount = requestData.giftAmount;
      }

      // Apply updates
      await runSettings.update(updates);

      // Reload run settings to get the updated values
      await runSettings.reload();

      return createSuccessResponse("Run settings updated successfully", {
        runSettings: runSettings,
      });
    } catch (error) {
      console.error("Error in saveRunSettings handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
