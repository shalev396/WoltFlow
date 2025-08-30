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

// Connect to database
await initDB();

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
    try {
      // Find settings with wolt settings included
      const settings = (await Settings.findOne({
        where: { userId: event.userId! },
        include: [
          {
            model: WoltSettings,
            as: "woltSettings",
            required: false,
          },
        ],
      })) as SettingsWithWoltSettings;

      if (!settings) {
        return createSuccessResponse("Wolt settings retrieved successfully", {
          woltSettings: null,
        });
      }

      const woltSettings = settings.woltSettings;

      return createSuccessResponse("Wolt settings retrieved successfully", {
        woltSettings: woltSettings || null,
      });
    } catch (error) {
      console.error("Error in getWoltSettings handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
