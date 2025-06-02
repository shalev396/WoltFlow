import { APIGatewayProxyHandler } from "aws-lambda";
import { verifyToken, generateTokens } from "../../utils/auth";
import { corsHeaders, errorHandler } from "../../utils/middleware";
import User from "../../models/User";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { refreshToken } = JSON.parse(event.body || "{}");

    if (!refreshToken) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Refresh token is required",
          statusCode: 400,
        }),
      };
    }

    const decoded = verifyToken(refreshToken);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "User not found",
          statusCode: 404,
        }),
      };
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(tokens),
    };
  } catch (error) {
    return errorHandler(error);
  }
};
