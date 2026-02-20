import dotenv from "dotenv";
import { Run, User } from "../../classes/index.js";
import {
  type ICustomStepFunctionResult,
  type ICustomAPIGatewayProxyEventStepFunction,
} from "../../types/index.js";
import { refreshTokens } from "../../utils/automation.js";
import { notifyOnError } from "../../utils/notificationUtil.js";
import { initDB } from "../../config/bootstrap.js";
import { getErrorMessage } from "../../utils/responseUtil.js";

dotenv.config();

await initDB();

export const handler = async (
  event: ICustomAPIGatewayProxyEventStepFunction
): Promise<ICustomStepFunctionResult> => {
  let runId: string | undefined;
  let userId: string | undefined;

  try {
    runId = event.runId || event.queryStringParameters?.runId;

    if (!runId) {
      return {
        runId: "",
        userId: "",
        success: false,
        completed: false,
        message: "Missing runId parameter",
      };
    }

    const data = await Run.findWithWoltSettings(runId);

    if (!data) {
      return {
        runId: "",
        userId: "",
        success: false,
        completed: false,
        message: "Run not found",
      };
    }

    userId = data.userId;

    await Run.updateStage(runId, "refreshing_tokens");

    if (!data.hasWoltSettings) {
      await Run.markFailed(runId);
      return {
        runId: "",
        userId: "",
        success: false,
        completed: false,
        message: "Settings or Wolt settings not found for user",
      };
    }

    try {
      if (!data.woltRefreshToken) {
        await Run.markFailed(runId);

        try {
          await notifyOnError(userId, runId, "No refresh token found");
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

      const tokenResponse = await refreshTokens(data.woltRefreshToken);

      const newWrtoken = tokenResponse.refresh_token;
      const newWtoken = JSON.stringify({
        accessToken: tokenResponse.access_token,
        expirationTime: tokenResponse.decoded_exp
          ? tokenResponse.decoded_exp * 1000
          : Date.now() + tokenResponse.expires_in * 1000,
      });

      await User.updateWoltTokens(userId, newWrtoken, newWtoken);

      console.log("Tokens refreshed successfully for run:", runId);

      const isStepFunctions = !!event.runId || !!event.Payload?.runId;

      if (isStepFunctions) {
        return {
          runId,
          userId,
          success: true,
          message: "Tokens refreshed successfully",
        } as ICustomStepFunctionResult;
      } else {
        return {
          runId,
          userId,
          success: true,
          completed: true,
          message: "Tokens refreshed successfully",
        };
      }
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
      await Run.markFailed(runId);

      try {
        await notifyOnError(userId, runId, "Token refresh failed");
      } catch (notificationError) {
        console.error(
          "Failed to send error notification:",
          notificationError
        );
      }

      const isStepFunctions = !!event.runId || !!event.Payload?.runId;

      if (isStepFunctions) {
        throw new Error(
          `Token refresh failed: ${getErrorMessage(refreshError)}`
        );
      } else {
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
    if (runId) {
      await Run.markFailed(runId, getErrorMessage(error));

      try {
        if (userId) {
          await notifyOnError(userId, runId, "Automation error occurred");
        }
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }
    }

    const isStepFunctions = !!event.runId || !!event.Payload?.runId;

    if (isStepFunctions) {
      throw error;
    } else {
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
