import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import sequelize from "../../config/database.js";
import {
  User,
  Run,
  Settings,
  RunSettings,
  NotificationSettings,
} from "../../models/index.js";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
import { notifyOnError } from "../../utils/notificationUtil.js";
import dotenv from "dotenv";
import { syncDatabase } from "../../config/bootstrap.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../utils/responseUtil.js";

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

    // Get all users with their settings in one optimized query
    const users = await User.findAll({
      include: [
        {
          model: Settings,
          as: "settings",
          required: false,
          include: [
            {
              model: RunSettings,
              as: "runSettings",
              required: false,
            },
            {
              model: NotificationSettings,
              as: "notificationSettings",
              required: false,
            },
          ],
        },
      ],
    });

    if (users.length === 0) {
      return createSuccessResponse("No users found to start automation", {
        executionStarted: false,
      });
    }

    const userRunData = [];
    const errors = [];

    for (const user of users) {
      try {
        const userSettings = (user as any).settings;
        const runSettings = userSettings?.runSettings;
        const notificationSettings = userSettings?.notificationSettings;

        // Skip users without run settings (automation disabled)
        if (!runSettings) {
          console.log(
            `Skipping user ${user.id} - no run settings found (automation disabled)`
          );
          continue;
        }

        // Create a new run for this user
        const newRun = await Run.create({
          userId: user.id,
          status: "started",
          stage: "triggered",
          automationMode: runSettings.automationMode || "full-run",
          errorMessage: null,
        });

        console.log(`Created run ${newRun.id} for user ${user.id}`);

        // Prepare data for Step Functions
        userRunData.push({
          userId: user.id.toString(),
          runId: newRun.id.toString(),
          automationMode: runSettings.automationMode || "full-run",
          giftAmount: Number(runSettings.giftAmount) || 0,
          isNotification: notificationSettings?.isEnabled || false,
        });
      } catch (userError: any) {
        console.error(`Error preparing run for user ${user.id}:`, userError);
        errors.push({
          userId: user.id.toString(),
          error: userError.message,
        });

        // Send error notification to user if run was created
        try {
          const failedRun = await Run.findOne({
            where: { userId: user.id },
            order: [["createdAt", "DESC"]],
          });
          if (failedRun) {
            await failedRun.update({
              status: "failed",
              errorMessage: userError.message,
            });
            await notifyOnError(
              user.id.toString(),
              failedRun.id,
              "Automation setup failed"
            );
          }
        } catch (notificationError) {
          console.error(
            "Failed to send error notification:",
            notificationError
          );
        }
      }
    }

    if (userRunData.length === 0) {
      return createSuccessResponse("No users with automation enabled found", {
        executionStarted: false,
        totalUsers: users.length,
        errors: errors.length > 0 ? errors : undefined,
      });
    }

    // Start Step Functions execution
    if (ENV === "local") {
      // For local development, we can't easily test Step Functions
      // So we'll just return the data that would be sent
      console.log(
        "Running in local mode - would start Step Functions with data:",
        JSON.stringify({ users: userRunData }, null, 2)
      );

      return createSuccessResponse(
        "Local mode - Step Functions execution simulated",
        {
          totalUsers: users.length,
          enabledUsers: userRunData.length,
          userData: userRunData,
          errors: errors.length > 0 ? errors : undefined,
        }
      );
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

      return createSuccessResponse(
        "User automation chain started successfully",
        {
          totalUsers: users.length,
          enabledUsers: userRunData.length,
          executionArn: executionResult.executionArn,
          errors: errors.length > 0 ? errors : undefined,
        }
      );
    }
  } catch (error: any) {
    console.error("Error starting user automation chain:", error);
    return createErrorResponse(getErrorMessage(error));
  }
};
