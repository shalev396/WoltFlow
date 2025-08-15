import { Settings, CibusSettings } from "../../../models/index.js";
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

interface SaveCibusSettingsRequest {
  cibusUsername?: string | null;
  cibusPassword?: string | null;
  cibusCompany?: string | null;
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

      const requestData: SaveCibusSettingsRequest = JSON.parse(event.body);

      // Find or create main settings record with cibus settings included
      let [settings] = await Settings.findOrCreate({
        where: { userId: event.userId! },
        defaults: { userId: event.userId! },
        include: [
          {
            model: CibusSettings,
            as: "cibusSettings",
            required: false,
          },
        ],
      });

      // Get or create cibus settings
      let cibusSettings: CibusSettings;

      if ((settings as any).cibusSettings) {
        cibusSettings = (settings as any).cibusSettings;
      } else {
        // Create new cibus settings
        cibusSettings = await CibusSettings.create({
          cibusUsername: null,
          cibusPassword: null,
          cibusCompany: null,
        });

        // Link it to the settings
        await settings.update({
          cibusSettingsId: cibusSettings.id,
        });
      }

      // Update cibus settings fields
      const updates: Partial<typeof requestData> = {};

      if (requestData.cibusUsername !== undefined) {
        updates.cibusUsername = requestData.cibusUsername;
      }
      if (requestData.cibusPassword !== undefined) {
        updates.cibusPassword = requestData.cibusPassword;
      }
      if (requestData.cibusCompany !== undefined) {
        updates.cibusCompany = requestData.cibusCompany;
      }

      // Apply updates
      await cibusSettings.update(updates);

      // Reload cibus settings to get the updated values
      await cibusSettings.reload();

      console.log(`Cibus settings updated for user ${event.userId}:`, {
        cibusUsername: cibusSettings.cibusUsername,
        cibusCompany: cibusSettings.cibusCompany,
        // Don't log password for security
      });

      return createSuccessResponse("Cibus settings updated successfully", {
        cibusSettings: cibusSettings,
      });
    } catch (error) {
      console.error("Error in saveCibusSettings handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
