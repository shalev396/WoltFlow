// src/handlers/setting/setUserSettings.ts
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws";
import sequelize from "../../config/database";
import Setting from "../../models/Setting";
import { authMiddleware } from "../../middlewares/auth";

interface UpdateBody {
  isNotification?: boolean;
  woltAccessToken?: string;
  woltRefreshToken?: string;
  wrtoken?: string;
  wtoken?: string;
  cibusName?: string;
  cibusPassword?: string;
  cibusCompany?: string;
  giftAmount?: number;
}

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event) => {
    try {
      await sequelize.authenticate();

      // Parse incoming fields
      const body: UpdateBody = JSON.parse(event.body || "{}");

      // 1) find existing settings, or create a new row with just userId
      const [settings] = await Setting.findOrCreate({
        where: { userId: event.userId },
        defaults: { userId: event.userId },
      });

      // 2) apply only the fields the user sent
      const updates: Partial<UpdateBody> = {};
      (Object.keys(body) as Array<keyof UpdateBody>).forEach((key) => {
        const value = body[key];
        if (value !== undefined) {
          (updates as any)[key] = value;
        }
      });

      // 3) persist and return
      await settings.update(updates);

      return {
        statusCode: 200,
        body: JSON.stringify(settings),
      };
    } catch (error) {
      console.error("Error in setUserSettings:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  }
);
