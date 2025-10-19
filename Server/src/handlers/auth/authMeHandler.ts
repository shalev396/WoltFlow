import { authMiddleware } from "../../middlewares/auth.js";
import { User } from "../../models/index.js";
import { initDB } from "../../config/bootstrap.js";

await initDB();

export const handler = authMiddleware(async (event) => {
  try {
    // userId is set by authMiddleware (cognitoSub)
    const user = await User.findOne({
      where: { cognitoSub: event.userId },
    });

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          message: "User not found",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "User retrieved successfully",
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
      }),
    };
  } catch (error) {
    console.error("Get user error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Failed to retrieve user",
      }),
    };
  }
});
