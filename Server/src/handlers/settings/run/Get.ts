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

// Connect to database
await initDB();

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
    try {
      // Find settings with run settings included
      const settings = (await Settings.findOne({
        where: { userId: event.userId! },
        include: [
          {
            model: RunSettings,
            as: "runSettings",
            required: false,
          },
        ],
      })) as SettingsWithRunSettings;

      if (!settings) {
        return createSuccessResponse("Run settings retrieved successfully", {
          runSettings: null,
        });
      }

      const runSettings = settings.runSettings;

      return createSuccessResponse("Run settings retrieved successfully", {
        runSettings: runSettings || null,
      });
    } catch (error) {
      console.error("Error in getRunSettings handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
