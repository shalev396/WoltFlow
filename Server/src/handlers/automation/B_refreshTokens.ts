import sequelize from "../../config/database.js";
import { Settings, WoltSettings, Run, User } from "../../models/index.js";
import { ICustomAPIGatewayProxyEventStepFunction } from "../../typescript/interfaces/aws.js";
import { APIGatewayProxyResult } from "aws-lambda";
import { refreshTokens } from "../../utils/automation.js";
import { notifyOnError } from "../../utils/notificationUtil.js";
import dotenv from "dotenv";
import { syncDatabase } from "../../config/bootstrap.js";
import {
  createSuccessResponse,
  createErrorResponse,
  createSuccessData,
  getErrorMessage,
} from "../../utils/responseUtil.js";

// Environment variables
dotenv.config();

// Connect to database
await sequelize.authenticate();
await syncDatabase();

export const handler = async (
  event: ICustomAPIGatewayProxyEventStepFunction
): Promise<APIGatewayProxyResult> => {
  let run: Run | null = null;

  try {
    // Extract runId from event (Step Functions or API Gateway)
    const runId = event.runId || event.queryStringParameters?.["runId"];

    if (!runId) {
      return createErrorResponse("Missing runId parameter", 400);
    }

    // Get the run with user settings in one optimized query
    run = await Run.findByPk(runId, {
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
    });

    if (!run) {
      return createErrorResponse("Run not found", 404);
    }

    const userId = run.userId;

    // Update run stage
    await run.update({ stage: "refreshing_tokens" });

    // Get user settings from the included data
    const userWithSettings = (run as any).user;
    const settings = userWithSettings?.settings;
    const woltSettings = settings?.woltSettings;

    if (!settings || !woltSettings) {
      await run.update({ status: "failed" });
      return createErrorResponse(
        "Settings or Wolt settings not found for user",
        404
      );
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

        return createErrorResponse("No refresh token found in settings", 400);
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
        // Return raw data for Step Functions
        return createSuccessData("Tokens refreshed successfully", {
          runId,
          userId: run.userId,
        }) as any;
      } else {
        // Return API Gateway format for HTTP calls
        return createSuccessResponse("Tokens refreshed successfully", {
          runId,
          userId: run.userId,
        });
      }
    } catch (refreshError: any) {
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
        throw new Error(`Token refresh failed: ${refreshError.message}`);
      } else {
        // Return API Gateway error format for HTTP calls
        return createErrorResponse(getErrorMessage(refreshError));
      }
    }
  } catch (error: any) {
    console.error("RefreshTokens handler error:", error);
    if (run) {
      await run.update({ status: "failed", errorMessage: error.message });

      // Send error notification to user
      try {
        await notifyOnError(
          run.userId.toString(),
          run.id,
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
      return createErrorResponse(getErrorMessage(error));
    }
  }
};
