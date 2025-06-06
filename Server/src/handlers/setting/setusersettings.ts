import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws";
import sequelize from "../../config/database";
import Setting from "../../models/Setting";

interface UpdateBody {
  isNotification?: boolean;
  woltAccessToken?: string;
  woltRefreshToken?: string;
  cibusName?: string;
  cibusPassword?: string;
  cibusCompany?: string;
  giftAmount?: number;
}

export const handler: CustomAPIGatewayProxyHandler = async (
  event //, context
) => {
  await sequelize.authenticate();
  const body: UpdateBody = JSON.parse(event.body || "{}");

  const settings = await Setting.findOne({ where: { userId: event.userId } });
  if (!settings) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Settings not found" }),
    };
  }

  await settings.update(body);
  return {
    statusCode: 200,
    body: JSON.stringify(settings),
  };
};
