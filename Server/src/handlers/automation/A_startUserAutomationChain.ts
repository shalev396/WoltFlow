import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";

import {
  User,
  Run,
  Settings,
  RunSettings,
  NotificationSettings,
} from "../../models/index.js";
import {
  type UserWithRunSettingsAndNotificationSettings,
  type ICustomStepFunctionResult,
} from "../../types/index.js";
import { notifyOnError } from "../../utils/notificationUtil.js";
import dotenv from "dotenv";
import { initDB } from "../../config/bootstrap.js";
import { getErrorMessage } from "../../utils/responseUtil.js";

// Environment variables
dotenv.config();
const sfnClient = new SFNClient({
  region: process.env.AWS_REGION,
});

await initDB();

export const handler = async (): Promise<ICustomStepFunctionResult> => {
  try {
    console.log("Starting User Automation Chain with Step Functions");

    // Get all users with their settings in one optimized query
    const users = (await User.findAll({
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
    })) as UserWithRunSettingsAndNotificationSettings[];

    if (users.length === 0) {
      return {
        runId: "",
        userId: "",
        success: false,
        completed: false,
        message: "No users found to start automation",
      };
    }

    const userRunData = [];
    const errors = [];

    for (const user of users) {
      try {
        const userSettings = user.settings;
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
          amount: runSettings.giftAmount || null,
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
      } catch (userError) {
        console.error(`Error preparing run for user ${user.id}:`, userError);
        // Type-safe error handling
        const errorMessage =
          userError instanceof Error ? userError.message : String(userError);
        errors.push({
          userId: user.id.toString(),
          error: errorMessage,
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
              errorMessage: errorMessage,
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
      return {
        runId: "",
        userId: "",
        success: false,
        completed: false,
        message: "No users with automation enabled found",
      };
    }

    // Start Step Functions execution
    // For production, start the actual Step Functions execution
    const stateMachineArn = process.env.USER_AUTOMATION_STATE_MACHINE_ARN;
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
      runId: "",
      userId: "",
      success: true,
      completed: true,
      message: "User automation chain started successfully",
    };
  } catch (error) {
    console.error("Error starting user automation chain:", error);
    return {
      runId: "",
      userId: "",
      success: false,
      completed: false,
      message: getErrorMessage(error),
    };
  }
};
