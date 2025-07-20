import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import sequelize from "../../config/database.js";
import User from "../../models/User.js";
import Run from "../../models/Run.js";
import Setting from "../../models/Setting.js";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
import dotenv from "dotenv";

// Environment variables
dotenv.config();

const ENV = process.env["ENV"];

// Connect to database
await sequelize.authenticate();

const lambdaClient = new LambdaClient({
  region: process.env["AWS_REGION"] || "", // Use AWS_REGION (standard) or default to provider region
});
export const handler: CustomAPIGatewayProxyHandler = async (_event?) => {
  try {
    const baseURL_LOCAL = "http://localhost:3000/api";

    // Ensure Run table exists (dev only)
    if (process.env["ENV"] === "Development") {
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
          where: { userId: user.get("userId") },
        });

        if (!userSettings) {
          console.log(
            `Skipping user ${user.get("userId")} - no settings found`
          );
          continue;
        }

        // Check if automation is enabled for this user
        if (!userSettings.get("automationEnabled")) {
          console.log(
            `Skipping user ${user.get("userId")} - automation disabled`
          );
          continue;
        }

        // Create a new run for this user
        const newRun = await Run.create({
          user_id: user.get("userId"),
          status: "in progress",
          stage: "triggered",
          amount: Number(userSettings.get("giftAmount")) || 0,
          is_notify: userSettings.get("isNotification") || false,
          mode: userSettings.get("automationMode") || "full-run",
        });

        console.log(
          `Created run ${newRun.get("id")} for user ${user.get("userId")}`
        );

        // Fire-and-forget trigger refreshTokens function with runId
        if (ENV === "local") {
          // For serverless offline, make HTTP request without waiting
          console.log(
            `Triggering refreshTokens for run ${newRun.get(
              "id"
            )} (offline mode)`
          );

          fetch(
            `${baseURL_LOCAL}/wolt/refreshTokens?runId=${newRun.get("id")}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          ).catch((error) => {
            console.error(
              `HTTP request to refreshTokens failed for run ${newRun.get(
                "id"
              )}:`,
              error
            );
          });
        } else {
          // For production, use Lambda invoke with fire-and-forget
          const functionName = process.env["REFRESH_TOKENS_FUNCTION_NAME"]!;
          const invokeParams = {
            FunctionName: functionName,
            InvocationType: "Event" as const,
            Payload: JSON.stringify({
              queryStringParameters: {
                runId: newRun.get("id").toString(),
              },
            }),
          };

          console.log(
            `Attempting to invoke Lambda function: ${functionName} with runId: ${newRun.get(
              "id"
            )}`
          );

          try {
            // Synchronous invoke to ensure we see the result
            const command = new InvokeCommand(invokeParams);
            const result = await lambdaClient.send(command);

            console.log(
              `Successfully invoked refreshTokens Lambda for run ${newRun.get(
                "id"
              )}. Status: ${result.StatusCode}`
            );
          } catch (error) {
            console.error(
              `Lambda invoke to refreshTokens failed for run ${newRun.get(
                "id"
              )}:`,
              error
            );
          }
        }

        runsStarted.push({
          runId: newRun.get("id"),
          userId: user.get("userId"),
          status: "triggered",
        });
      } catch (userError: any) {
        console.error(
          `Error starting run for user ${user.get("userId")}:`,
          userError
        );
        errors.push({
          userId: user.get("userId"),
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
