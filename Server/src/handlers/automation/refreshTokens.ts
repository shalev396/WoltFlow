import sequelize from "../../config/database.js";
import Setting from "../../models/Setting.js";
import Run from "../../models/Run.js";
import { ICustomAPIGatewayProxyEventStepFunction } from "../../typescript/interfaces/aws.js";
import { APIGatewayProxyResult } from "aws-lambda";
import { refreshTokens } from "../../utils/automation.js";
import { notifyOnError } from "../../utils/notificationUtil.js";
import dotenv from "dotenv";
import "../../config/bootstrap.js";
import { syncDatabase } from "../../config/bootstrap.js";

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
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing runId parameter" }),
      };
    }

    // Get the run and associated user
    run = await Run.findByPk(runId);
    if (!run) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Run not found" }),
      };
    }

    const userId = run.get("user_id");

    // Update run stage
    await run.update({ stage: "refreshing tokens" });

    // Get user settings
    const settings = await Setting.findOne({ where: { userId } });
    if (!settings) {
      await run.update({ status: "failed" });
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Settings not found for user" }),
      };
    }

    try {
      // Check if we have a refresh token to work with
      if (!settings.get("wrtoken")) {
        await run.update({ status: "failed" });

        // Send error notification to user
        try {
          await notifyOnError(run.user_id, run.id, "No refresh token found");
        } catch (notificationError) {
          console.error(
            "Failed to send error notification:",
            notificationError
          );
        }

        return {
          statusCode: 400,
          body: JSON.stringify({ error: "No refresh token found in settings" }),
        };
      }

      // Refresh the tokens using the existing refresh token
      const tokenResponse = await refreshTokens(
        settings.get("wrtoken") as string
      );

      // Format the tokens as specified
      const newWrtoken = tokenResponse.refresh_token;
      const newWtoken = JSON.stringify({
        accessToken: tokenResponse.access_token,
        expirationTime: tokenResponse.decoded_exp
          ? tokenResponse.decoded_exp * 1000
          : Date.now() + tokenResponse.expires_in * 1000,
      });

      // Update settings with new tokens
      await settings.update({
        wrtoken: newWrtoken,
        wtoken: newWtoken,
      });

      console.log("Tokens refreshed successfully for run:", runId);

      // Return success for Step Functions to continue chain
      // Check if this is a Step Functions call (has runId directly in event)
      const isStepFunctions = !!event.runId || !!event.Payload?.runId;

      if (isStepFunctions) {
        // Return raw data for Step Functions
        return {
          runId,
          userId: run.get("user_id"),
          success: true,
          message: "Tokens refreshed successfully",
        } as any;
      } else {
        // Return API Gateway format for HTTP calls
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Tokens refreshed successfully",
            runId,
            userId: run.get("user_id"),
            success: true,
          }),
        };
      }
    } catch (refreshError: any) {
      console.error("Token refresh failed:", refreshError);
      if (run) {
        await run.update({ status: "failed" });

        // Send error notification to user
        try {
          await notifyOnError(run.user_id, run.id, "Token refresh failed");
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
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: "Token refresh failed",
            details: refreshError.message,
          }),
        };
      }
    }
  } catch (error: any) {
    console.error("RefreshTokens handler error:", error);
    if (run) {
      await run.update({ status: "failed" });

      // Send error notification to user
      try {
        await notifyOnError(run.user_id, run.id, "Automation error occurred");
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
        statusCode: 500,
        body: JSON.stringify({
          error: "Internal server error",
          details: error.message,
        }),
      };
    }
  }
};
