import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws";
import sequelize from "../../config/database";
import Setting from "../../models/Setting";
import { authMiddleware } from "../../middlewares/auth";

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event) => {
    await sequelize.authenticate();
    const settings = await Setting.findOne({
      where: { userId: event.userId },
    });
    if (!settings) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Settings not found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(settings),
    };
  }
);
