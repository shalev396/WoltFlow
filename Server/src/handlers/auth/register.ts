import { APIGatewayProxyHandler } from "aws-lambda";
import { hashPassword, generateTokens } from "../../utils/auth";
import { corsHeaders, errorHandler } from "../../utils/middleware";
import User from "../../models/User";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (process.env.REGISTERABLE === "false") {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Registration is currently disabled",
          statusCode: 403,
        }),
      };
    }

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

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return {
        statusCode: 409,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Email already exists",
          statusCode: 409,
        }),
      };
    }

    const hashedPassword = await hashPassword(
      password + process.env.PASSWORD_SECRET
    );

    const user = await User.create({
      email,
      password: hashedPassword,
      in_notification: false,
      total_saved: 0.0,
    });

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    const { password: _, ...userWithoutPassword } = user.get();

    return {
      statusCode: 201,
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
