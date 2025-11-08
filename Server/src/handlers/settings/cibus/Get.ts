import { Settings, CibusSettings } from "../../../models/index.js";
import { authMiddleware } from "../../../middlewares/auth.js";
import { type CustomAPIGatewayProxyHandler } from "../../../types/aws.js";
import {
  type SettingsWithCibusSettings,
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
      // Find settings with cibus settings included
      const settings = (await Settings.findOne({
        where: { userId: event.userId! },
        include: [
          {
            model: CibusSettings,
            as: "cibusSettings",
            required: false,
          },
        ],
      })) as SettingsWithCibusSettings;

      if (!settings) {
        return createSuccessResponse("Cibus settings retrieved successfully", {
          cibusSettings: null,
        });
      }

      const cibusSettings = settings.cibusSettings;

      return createSuccessResponse("Cibus settings retrieved successfully", {
        cibusSettings: cibusSettings || null,
      });
    } catch (error) {
      console.error("Error in getCibusSettings handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
