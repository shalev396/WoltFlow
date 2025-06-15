import { Lambda } from "aws-sdk";
import sequelize from "../../config/database";
import User from "../../models/User";
import Run from "../../models/Run";
import Setting from "../../models/Setting";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws";

const lambda = new Lambda();

export const handler: CustomAPIGatewayProxyHandler = async (_event?) => {
  try {
    const isDev = process.env.ENV === "Development";
    const baseURL = isDev
      ? "http://localhost:3000/api"
      : `https://woltflow.shalev396.com/api`;
    await sequelize.authenticate();

    // Ensure Run table exists (dev only)
    if (process.env.ENV === "Development") {
      await Run.sync({ alter: true });
    }

    // Get all users from the database
    const users = await User.findAll();

    if (users.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "No users found to start runs",
          runsStarted: 0,
        }),
      };
    }

    const runsStarted = [];
    const errors = [];

    for (const user of users) {
      try {
        // Check if user has settings (required for automation)
        const userSettings = await Setting.findOne({
          where: { userId: user.userId },
        });

        if (!userSettings) {
          console.log(`Skipping user ${user.userId} - no settings found`);
          continue;
        }

        // Create a new run for this user
        const newRun = await Run.create({
          user_id: user.userId,
          status: "in progress",
          stage: "triggered",
          amount: Number(userSettings.giftAmount) || 0,
          is_notify: userSettings.isNotification || false,
        });

        console.log(`Created run ${newRun.id} for user ${user.userId}`);

        // Fire-and-forget trigger refreshTokens function with runId
        const isOffline = process.env.IS_OFFLINE === "true";

        if (isOffline) {
          // For serverless offline, make HTTP request without waiting
          console.log(
            `Triggering refreshTokens for run ${newRun.id} (offline mode)`
          );

          fetch(`${baseURL}/wolt/refreshTokens?runId=${newRun.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }).catch((error) => {
            console.error(
              `HTTP request to refreshTokens failed for run ${newRun.id}:`,
              error
            );
          });
        } else {
          // For production, use Lambda invoke with fire-and-forget
          const functionName = process.env.REFRESH_TOKENS_FUNCTION_NAME!;
          const invokeParams = {
            FunctionName: functionName,
            InvocationType: "Event" as const,
            Payload: JSON.stringify({
              queryStringParameters: { runId: newRun.id.toString() },
            }),
          };

          lambda
            .invoke(invokeParams)
            .promise()
            .catch((error) => {
              console.error(
                `Lambda invoke to refreshTokens failed for run ${newRun.id}:`,
                error
              );
            });
        }

        runsStarted.push({
          runId: newRun.id,
          userId: user.userId,
          status: "triggered",
        });
      } catch (userError: any) {
        console.error(`Error starting run for user ${user.userId}:`, userError);
        errors.push({
          userId: user.userId,
          error: userError.message,
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Automation runs started successfully",
        runsStarted: runsStarted.length,
        totalUsers: users.length,
        runs: runsStarted,
        errors: errors.length > 0 ? errors : undefined,
      }),
    };
  } catch (error: any) {
    console.error("Error starting automation runs:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to start automation runs",
        details: error.message,
      }),
    };
  }
};
