import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
import sequelize from "../../config/database.js";
import Setting from "../../models/Setting.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { ICustomAPIGatewayProxyEvent } from "../../typescript/interfaces/aws.js";

// Connect to database
await sequelize.authenticate();

export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEvent) => {
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
