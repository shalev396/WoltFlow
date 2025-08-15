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

// Connect to database
await sequelize.authenticate();
await syncDatabase();

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
    try {
      // Find settings with wolt settings included
      const settings = await Settings.findOne({
        where: { userId: event.userId! },
        include: [
          {
            model: WoltSettings,
            as: "woltSettings",
            required: false,
          },
        ],
      });

      if (!settings) {
        return createSuccessResponse("Wolt settings retrieved successfully", {
          woltSettings: null,
        });
      }

      const woltSettings = (settings as any).woltSettings;

      return createSuccessResponse("Wolt settings retrieved successfully", {
        woltSettings: woltSettings || null,
      });
    } catch (error) {
      console.error("Error in getWoltSettings handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
