import { APIGatewayProxyHandler } from "aws-lambda";
import { comparePassword, generateTokens } from "../../utils/auth";
import { corsHeaders, errorHandler } from "../../utils/middleware";
import User from "../../models/User";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body || "{}");

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Email and password are required",
          statusCode: 400,
        }),
      };
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Invalid credentials",
          statusCode: 401,
        }),
      };
    }

    const isValidPassword = await comparePassword(
      password + process.env.PASSWORD_SECRET,
      user.password
    );

    if (!isValidPassword) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Invalid credentials",
          statusCode: 401,
        }),
      };
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    const { password: _, ...userWithoutPassword } = user.get();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        ...tokens,
        user: userWithoutPassword,
      }),
    };
  } catch (error) {
    return errorHandler(error);
  }
};
