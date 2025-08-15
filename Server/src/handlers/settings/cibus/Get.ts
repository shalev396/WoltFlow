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

// Connect to database
await sequelize.authenticate();
await syncDatabase();
export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
    try {
      // Find settings with cibus settings included
      const settings = await Settings.findOne({
        where: { userId: event.userId! },
        include: [
          {
            model: CibusSettings,
            as: "cibusSettings",
            required: false,
          },
        ],
      });

      if (!settings) {
        return createSuccessResponse("Cibus settings retrieved successfully", {
          cibusSettings: null,
        });
      }

      const cibusSettings = (settings as any).cibusSettings;

      return createSuccessResponse("Cibus settings retrieved successfully", {
        cibusSettings: cibusSettings || null,
      });
    } catch (error) {
      console.error("Error in getCibusSettings handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
