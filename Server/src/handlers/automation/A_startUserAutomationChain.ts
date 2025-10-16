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

export const handler = async (event?: {
  userId?: string;
}): Promise<ICustomStepFunctionResult> => {
  try {
    const targetUserId = event?.userId;

    if (targetUserId) {
      console.log(
        `Starting User Automation Chain for specific user: ${targetUserId}`
      );
    } else {
      console.log(
        "Starting User Automation Chain with Step Functions for all users"
      );
    }

    // Build where clause to filter by userId if provided
    const whereClause = targetUserId ? { id: targetUserId } : {};

    // Get users with their settings in one optimized query
    const users = (await User.findAll({
      where: whereClause,
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
      const message = targetUserId
        ? `User ${targetUserId} not found or does not exist`
        : "No users found to start automation";

      return {
        runId: "",
        userId: targetUserId || "",
        success: false,
        completed: false,
        message,
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
        // // Set data expiry to 90 days from now (ensure field is set)
        // const dataExpiresAt = new Date();
        // dataExpiresAt.setDate(dataExpiresAt.getDate() + 90);
        // dataExpiresAt.setHours(23, 59, 59, 999);

        const newRun = await Run.create({
          userId: user.id,
          status: "started",
          stage: "triggered",
          automationMode: runSettings.automationMode || "full-run",
          amount: runSettings.giftAmount || null,
          errorMessage: null,
          // dataExpiresAt: dataExpiresAt,
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
          } else {
            // No run exists, create a minimal failed run for notification tracking
            const failedRunForNotification = await Run.create({
              userId: user.id,
              status: "failed",
              stage: "triggered",
              automationMode: "full-run", // Default since we can't access runSettings here
              amount: null, // Default since we can't access runSettings here
              errorMessage: errorMessage,
              // dataExpiresAt: (() => {
              //   const expiryDate = new Date();
              //   expiryDate.setDate(expiryDate.getDate() + 90);
              //   expiryDate.setHours(23, 59, 59, 999);
              //   return expiryDate;
              // })(),
            });
            await notifyOnError(
              user.id.toString(),
              failedRunForNotification.id,
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
      const message = targetUserId
        ? `User ${targetUserId} does not have automation enabled (no run settings found)`
        : "No users with automation enabled found";

      return {
        runId: "",
        userId: targetUserId || "",
        success: false,
        completed: false,
        message,
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
      triggeredBy: targetUserId
        ? `manual-user-${targetUserId}`
        : "automated-schedule",
    };

    const executionName = targetUserId
      ? `automation-user-${targetUserId}-${Date.now()}`
      : `automation-${Date.now()}`;

    const startExecutionCommand = new StartExecutionCommand({
      stateMachineArn: stateMachineArn,
      name: executionName, // Unique execution name
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
