import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import sequelize from "../../config/database.js";
import Setting from "../../models/Setting.js";
import Run from "../../models/Run.js";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
import { refreshTokens } from "../../utils/automation.js";
import dotenv from "dotenv";

// Environment variables
dotenv.config();

const ENV = process.env["ENV"];
// Connect to database
await sequelize.authenticate();

const lambdaClient = new LambdaClient({
  region: process.env["AWS_REGION"] || "", // Use AWS_REGION (standard) or default to provider region
});

export const handler: CustomAPIGatewayProxyHandler = async (event) => {
  let run: Run | null = null;
  const baseURL_LOCAL = "http://localhost:3000/api";

  try {
    const runId = event.queryStringParameters?.["runId"];
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

      // Fire-and-forget invoke woltBuyGift function
      if (ENV === "local") {
        // For serverless offline, make HTTP request without waiting
        console.log(
          "Running in offline mode, triggering woltBuyGift (fire-and-forget)"
        );

        // Fire and forget - don't await the response
        fetch(`${baseURL_LOCAL}/wolt/buyGift?runId=${runId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((error) => {
          console.error(
            "HTTP request to woltBuyGift failed (but continuing):",
            error
          );
        });

        console.log(
          "woltBuyGift HTTP request triggered (not waiting for completion)"
        );
      } else {
        // For production, use Lambda invoke with fire-and-forget
        const functionName = process.env["WOLT_BUY_GIFT_FUNCTION_NAME"]!;
        const invokeParams = {
          FunctionName: functionName,
          InvocationType: "Event" as const, // Fire and forget
          Payload: JSON.stringify({
            queryStringParameters: { runId },
          }),
        };

        // Fire and forget - don't await the response
        // Synchronous invoke to ensure we see the result
        const command = new InvokeCommand(invokeParams);
        const result = await lambdaClient.send(command);

        console.log(
          `woltBuyGift Lambda invocation triggered (not waiting for completion)Status: ${result?.StatusCode}`
        );
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message:
            "Tokens refreshed successfully and woltBuyGift function triggered",
          runId,
        }),
      };
    } catch (refreshError: any) {
      console.error("Token refresh failed:", refreshError);
      if (run) {
        await run.update({ status: "failed" });
      }
      //TODO:send failed sms
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Token refresh failed",
          details: refreshError.message,
        }),
      };
    }
  } catch (error: any) {
    console.error("RefreshTokens handler error:", error);
    if (run) {
      await run.update({ status: "failed" });
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    };
  }
};
