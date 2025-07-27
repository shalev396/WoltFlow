// src/handlers/setting/setUserSettings.ts
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
import sequelize from "../../config/database.js";
import Setting from "../../models/Setting.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { ICustomAPIGatewayProxyEvent } from "../../typescript/interfaces/aws.js";
import { syncDatabase } from "../../config/bootstrap.js";
// Connect to database
await sequelize.authenticate();
await syncDatabase();
interface UpdateBody {
  isNotification?: boolean;
  hasGmailAccess?: boolean;
  automationEnabled?: boolean;
  automationMode?: "full-run" | "buy-only" | "cross-account";
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
  async (event: ICustomAPIGatewayProxyEvent) => {
    try {
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
