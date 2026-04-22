import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { User, Run } from "../../classes/index.js";
import {
  type ICustomStepFunctionResult,
} from "../../types/index.js";
import { notifyOnError } from "../../utils/notificationUtil.js";
import dotenv from "dotenv";
import { initDB } from "../../config/bootstrap.js";
import { getErrorMessage } from "../../utils/responseUtil.js";

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

    const automationUsers = await User.findAllForAutomation(targetUserId);

    if (targetUserId && automationUsers.length === 0) {
      return {
        runId: "",
        userId: targetUserId,
        success: false,
        completed: false,
        message: `User ${targetUserId} does not have automation enabled (no run settings found)`,
      };
    }

    if (automationUsers.length === 0) {
      return {
        runId: "",
        userId: "",
        success: false,
        completed: false,
        message: "No users with automation enabled found",
      };
    }

    const userRunData = [];
    const errors = [];

    for (const userData of automationUsers) {
      try {
        const newRun = await Run.createForAutomation(
          userData.userId,
          userData.giftAmount,
        );

        console.log(`Created run ${newRun.id} for user ${userData.userId}`);

        userRunData.push({
          userId: userData.userId,
          runId: newRun.id,
          giftAmount: Number(userData.giftAmount) || 0,
          isNotification: userData.isNotificationEnabled,
        });
      } catch (userError) {
        console.error(`Error preparing run for user ${userData.userId}:`, userError);
        const errorMessage =
          userError instanceof Error ? userError.message : String(userError);
        errors.push({
          userId: userData.userId,
          error: errorMessage,
        });

        try {
          const failedRun = await Run.findLatestForUser(userData.userId);
          if (failedRun) {
            await Run.markFailed(failedRun.id, errorMessage);
            await notifyOnError(
              userData.userId,
              failedRun.id,
              "Automation setup failed"
            );
          } else {
            const failedRunForNotification = await Run.createFailed(
              userData.userId,
              errorMessage,
            );
            await notifyOnError(
              userData.userId,
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
      name: executionName,
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
