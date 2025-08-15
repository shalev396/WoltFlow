import { Settings, RunSettings } from "../../../models/index.js";
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

interface SaveRunSettingsRequest {
  automationMode?: "full-run" | "buy-only" | "cross-account";
  giftAmount?: number | null;
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

      const requestData: SaveRunSettingsRequest = JSON.parse(event.body);

      // Find or create main settings record with run settings included
      let [settings] = await Settings.findOrCreate({
        where: { userId: event.userId! },
        defaults: { userId: event.userId! },
        include: [
          {
            model: RunSettings,
            as: "runSettings",
            required: false,
          },
        ],
      });

      // Get or create run settings
      let runSettings: RunSettings;

      if ((settings as any).runSettings) {
        runSettings = (settings as any).runSettings;
      } else {
        // Create new run settings
        runSettings = await RunSettings.create({
          settingsId: settings.id,
          automationMode: "full-run",
          giftAmount: null,
        });
      }

      // Update run settings fields
      const updates: Partial<typeof requestData> = {};

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

      console.log(`Run settings updated for user ${event.userId}:`, {
        automationMode: runSettings.automationMode,
        giftAmount: runSettings.giftAmount,
      });

      return createSuccessResponse("Run settings updated successfully", {
        runSettings: runSettings,
      });
    } catch (error) {
      console.error("Error in saveRunSettings handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
