import dotenv from "dotenv";
import { Settings, WoltSettings, Run, User } from "../../models/index.js";
import {
  type ICustomStepFunctionResult,
  type ICustomAPIGatewayProxyEventStepFunction,
  type RunWithUserWithWoltSettings,
} from "../../types/index.js";
import { refreshTokens } from "../../utils/automation.js";
import { notifyOnError } from "../../utils/notificationUtil.js";
import { initDB } from "../../config/bootstrap.js";
import { getErrorMessage } from "../../utils/responseUtil.js";

// Environment variables
dotenv.config();

// Connect to database
await initDB();

export const handler = async (
  event: ICustomAPIGatewayProxyEventStepFunction
): Promise<ICustomStepFunctionResult> => {
  let globalRun: Run | null = null;

  try {
    // Extract runId from event (Step Functions or API Gateway)
    const runId = event.runId || event.queryStringParameters?.runId;

    if (!runId) {
      return {
        runId: "",
        userId: "",
        success: false,
        completed: false,
        message: "Missing runId parameter",
      };
    }

    // Get the run with user settings in one optimized query
    let run = (await Run.findByPk(runId, {
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: Settings,
              as: "settings",
              include: [
                {
                  model: WoltSettings,
                  as: "woltSettings",
                },
              ],
            },
          ],
        },
      ],
    })) as RunWithUserWithWoltSettings;
    globalRun = run;
    if (!run) {
      return {
        runId: "",
        userId: "",
        success: false,
        completed: false,
        message: "Run not found",
      };
    }

    const userId = run.userId;

    // Update run stage
    await run.update({ stage: "refreshing_tokens" });

    // Get user settings from the included data
    const userWithSettings = run.user;
    const settings = userWithSettings?.settings;
    const woltSettings = settings?.woltSettings;

    if (!settings || !woltSettings) {
      await run.update({ status: "failed" });
      return {
        runId: "",
        userId: "",
        success: false,
        completed: false,
        message: "Settings or Wolt settings not found for user",
      };
    }

    try {
      // Check if we have a refresh token to work with
      if (!woltSettings.woltRefreshToken) {
        await run.update({ status: "failed" });

        // Send error notification to user
        try {
          await notifyOnError(
            userId.toString(),
            run.id,
            "No refresh token found"
          );
        } catch (notificationError) {
          console.error(
            "Failed to send error notification:",
            notificationError
          );
        }

        return {
          runId: "",
          userId: "",
          success: false,
          completed: false,
          message: "No refresh token found in settings",
        };
      }

      // Refresh the tokens using the existing refresh token
      const tokenResponse = await refreshTokens(woltSettings.woltRefreshToken);

      // Format the tokens as specified
      const newWrtoken = tokenResponse.refresh_token;
      const newWtoken = JSON.stringify({
        accessToken: tokenResponse.access_token,
        expirationTime: tokenResponse.decoded_exp
          ? tokenResponse.decoded_exp * 1000
          : Date.now() + tokenResponse.expires_in * 1000,
      });

      // Update wolt settings with new tokens
      await woltSettings.update({
        woltRefreshToken: newWrtoken,
        woltAccessToken: newWtoken,
      });

      console.log("Tokens refreshed successfully for run:", runId);

      // Return success for Step Functions to continue chain
      // Check if this is a Step Functions call (has runId directly in event)
      const isStepFunctions = !!event.runId || !!event.Payload?.runId;

      if (isStepFunctions) {
        // Return raw data for Step Functions - at root level for JSONPath
        return {
          runId,
          userId: run.userId,
          success: true,
          message: "Tokens refreshed successfully",
        } as ICustomStepFunctionResult;
      } else {
        // Return API Gateway format for HTTP calls
        return {
          runId,
          userId: run.userId,
          success: true,
          completed: true,
          message: "Tokens refreshed successfully",
        };
      }
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
      if (run) {
        await run.update({ status: "failed" });

        // Send error notification to user
        try {
          await notifyOnError(
            run.userId.toString(),
            run.id,
            "Token refresh failed"
          );
        } catch (notificationError) {
          console.error(
            "Failed to send error notification:",
            notificationError
          );
        }
      }

      const isStepFunctions = !!event.runId || !!event.Payload?.runId;

      if (isStepFunctions) {
        // Throw error for Step Functions to catch
        throw new Error(
          `Token refresh failed: ${getErrorMessage(refreshError)}`
        );
      } else {
        // Return API Gateway error format for HTTP calls
        return {
          runId: "",
          userId: "",
          success: false,
          completed: false,
          message: getErrorMessage(refreshError),
        };
      }
    }
  } catch (error) {
    console.error("RefreshTokens handler error:", error);
    if (globalRun) {
      await globalRun.update({
        status: "failed",
        errorMessage: getErrorMessage(error),
      });

      // Send error notification to user
      try {
        await notifyOnError(
          globalRun.userId.toString(),
          globalRun.id,
          "Automation error occurred"
        );
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }
    }

    const isStepFunctions = !!event.runId || !!event.Payload?.runId;

    if (isStepFunctions) {
      // Re-throw error for Step Functions to catch
      throw error;
    } else {
      // Return API Gateway error format for HTTP calls
      return {
        runId: "",
        userId: "",
        success: false,
        completed: false,
        message: getErrorMessage(error),
      };
    }
  }
};
