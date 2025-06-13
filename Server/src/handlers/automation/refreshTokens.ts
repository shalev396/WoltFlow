import { Lambda } from "aws-sdk";
import sequelize from "../../config/database";
import Setting from "../../models/Setting";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws";
import { refreshTokens } from "../../utils/automation";

const lambda = new Lambda();

export const handler: CustomAPIGatewayProxyHandler = async (event) => {
  try {
    const uid = event.queryStringParameters?.userId;
    if (!uid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing userId parameter" }),
      };
    }

    await sequelize.authenticate();

    // Get user settings
    const settings = await Setting.findOne({ where: { userId: uid } });
    if (!settings) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Settings not found for user" }),
      };
    }

    // Check if we have a refresh token to work with
    if (!settings.wrtoken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No refresh token found in settings" }),
      };
    }

    try {
      // Refresh the tokens using the existing refresh token
      const tokenResponse = await refreshTokens(settings.wrtoken);

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

      console.log("Tokens refreshed successfully for user:", uid);

      // Fire-and-forget invoke woltBuyGift function
      const isOffline = process.env.IS_OFFLINE === "true";

      if (isOffline) {
        // For serverless offline, make HTTP request without waiting
        console.log(
          "Running in offline mode, triggering woltBuyGift (fire-and-forget)"
        );

        // Fire and forget - don't await the response
        fetch(`http://localhost:3000/api/wolt/buyGift?userId=${uid}`, {
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
        const functionName = process.env.WOLT_BUY_GIFT_FUNCTION_NAME!;
        const invokeParams = {
          FunctionName: functionName,
          InvocationType: "Event" as const, // Fire and forget
          Payload: JSON.stringify({
            queryStringParameters: { userId: uid },
          }),
        };

        // Fire and forget - don't await the response
        lambda
          .invoke(invokeParams)
          .promise()
          .catch((error) => {
            console.error(
              "Lambda invoke to woltBuyGift failed (but continuing):",
              error
            );
          });

        console.log(
          "woltBuyGift Lambda invocation triggered (not waiting for completion)"
        );
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message:
            "Tokens refreshed successfully and woltBuyGift function triggered",
          userId: uid,
        }),
      };
    } catch (refreshError: any) {
      console.error("Token refresh failed:", refreshError);
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
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    };
  }
};
