import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import sequelize from "../../config/database.js";
import User from "../../models/User.js";
import Run from "../../models/Run.js";
import Setting from "../../models/Setting.js";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
import dotenv from "dotenv";
import { syncDatabase } from "../../config/bootstrap.js";

// Environment variables
dotenv.config();

const ENV = process.env["ENV"];

const sfnClient = new SFNClient({
  region: process.env["AWS_REGION"] || "",
});

await sequelize.authenticate();
await syncDatabase();

export const handler: CustomAPIGatewayProxyHandler = async (_event?) => {
  try {
    console.log("Starting User Automation Chain with Step Functions");

    // Get all users from the database
    const users = await User.findAll();

    if (users.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "No users found to start automation",
          executionStarted: false,
        }),
      };
    }

    const userRunData = [];
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

        // Prepare data for Step Functions
        userRunData.push({
          userId: user.get("userId"),
          runId: newRun.get("id").toString(),
          automationMode: userSettings.get("automationMode") || "full-run",
          giftAmount: Number(userSettings.get("giftAmount")) || 0,
          isNotification: userSettings.get("isNotification") || false,
        });
      } catch (userError: any) {
        console.error(
          `Error preparing run for user ${user.get("userId")}:`,
          userError
        );
        errors.push({
          userId: user.get("userId"),
          error: userError.message,
        });
      }
    }

    if (userRunData.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "No users with automation enabled found",
          executionStarted: false,
          totalUsers: users.length,
          errors: errors.length > 0 ? errors : undefined,
        }),
      };
    }

    // Start Step Functions execution
    if (ENV === "local") {
      // For local development, we can't easily test Step Functions
      // So we'll just return the data that would be sent
      console.log(
        "Running in local mode - would start Step Functions with data:",
        JSON.stringify({ users: userRunData }, null, 2)
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Local mode - Step Functions execution simulated",
          totalUsers: users.length,
          enabledUsers: userRunData.length,
          userData: userRunData,
          errors: errors.length > 0 ? errors : undefined,
        }),
      };
    } else {
      // For production, start the actual Step Functions execution
      const stateMachineArn = process.env["USER_AUTOMATION_STATE_MACHINE_ARN"];
      if (!stateMachineArn) {
        throw new Error("USER_AUTOMATION_STATE_MACHINE_ARN not configured");
      }

      const executionInput = {
        users: userRunData,
        timestamp: new Date().toISOString(),
        triggeredBy: "automated-schedule",
      };

      const startExecutionCommand = new StartExecutionCommand({
        stateMachineArn: stateMachineArn,
        name: `automation-${Date.now()}`, // Unique execution name
        input: JSON.stringify(executionInput),
      });

      const executionResult = await sfnClient.send(startExecutionCommand);

      console.log(
        `Step Functions execution started: ${executionResult.executionArn}`
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "User automation chain started successfully",
          totalUsers: users.length,
          enabledUsers: userRunData.length,
          executionArn: executionResult.executionArn,
          errors: errors.length > 0 ? errors : undefined,
        }),
      };
    }
  } catch (error: any) {
    console.error("Error starting user automation chain:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to start user automation chain",
        details: error.message,
      }),
    };
  }
};
