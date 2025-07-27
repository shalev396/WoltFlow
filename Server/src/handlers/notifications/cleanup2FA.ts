import { Op } from "sequelize";
import TwoFA from "../../models/TwoFA.js";
import sequelize from "../../config/database.js";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { syncDatabase } from "../../config/bootstrap.js";
// Connect to database
await sequelize.authenticate();
await syncDatabase();

export const handler = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Starting 2FA cleanup job...");

    // Delete all expired 2FA codes
    const deletedCount = await TwoFA.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date(), // Less than current time (expired)
        },
      },
    });

    // Also delete verified codes older than 24 hours to keep database clean
    const verifiedDeletedCount = await TwoFA.destroy({
      where: {
        verified: true,
        createdAt: {
          [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000), // Older than 24 hours
        },
      },
    });

    console.log(
      `2FA cleanup completed: ${deletedCount} expired codes removed, ${verifiedDeletedCount} old verified codes removed`
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "2FA cleanup completed",
        expiredCodesRemoved: deletedCount,
        verifiedCodesRemoved: verifiedDeletedCount,
      }),
    };
  } catch (error) {
    console.error("Error in 2FA cleanup job:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "2FA cleanup failed",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
