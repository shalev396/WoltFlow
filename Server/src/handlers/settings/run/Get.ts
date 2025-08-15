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

// Connect to database
await sequelize.authenticate();
await syncDatabase();

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
    try {
      // Find settings with run settings included
      const settings = await Settings.findOne({
        where: { userId: event.userId! },
        include: [
          {
            model: RunSettings,
            as: "runSettings",
            required: false,
          },
        ],
      });

      if (!settings) {
        return createSuccessResponse("Run settings retrieved successfully", {
          runSettings: null,
        });
      }

      const runSettings = (settings as any).runSettings;

      return createSuccessResponse("Run settings retrieved successfully", {
        runSettings: runSettings || null,
      });
    } catch (error) {
      console.error("Error in getRunSettings handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
