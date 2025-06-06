import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws";
import sequelize from "../../config/database";
import Setting from "../../models/Setting";

export const handler: CustomAPIGatewayProxyHandler = async (event) => {
  await sequelize.authenticate();
  const settings = await Setting.findOne({ where: { userId: event.userId } });
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
};
