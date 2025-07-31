import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  sendSmsBySenderID,
  sendSmsByLongCode,
  sendSmsBySharedNumber,
  formatPhoneNumber,
} from "../../utils/smsUtil.js";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Test SMS Handler - Event:", JSON.stringify(event, null, 2));

  try {
    // Check if SMS is enabled via environment variable
    const enabledSMS = process.env["enabledSMS"]?.toLowerCase() === "true";
    if (!enabledSMS) {
      console.log(
        `Test SMS was not sent because SMS is disabled via environment variable (enabledSMS=${process.env["enabledSMS"]})`
      );
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "SMS functionality is currently disabled",
        }),
      };
    }

    // Parse the request body to get the phone number and test method
    const body = event.body ? JSON.parse(event.body) : {};
    let phoneNumber = body.phoneNumber;
    const method = body.method || "senderID"; // Default to senderID
    const longCodeNumber = body.longCodeNumber; // Required for longCode method

    if (!phoneNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Phone number is required",
        }),
      };
    }

    // Format phone number to international format if needed (default to Israel +972)
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    if (!formattedPhoneNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error:
            "Invalid phone number format. Please provide a valid phone number.",
        }),
      };
    }

    let result;
    let testDescription;

    switch (method) {
      case "senderID":
        testDescription = "Sender ID (WoltFlow)";
        result = await sendSmsBySenderID({
          phoneNumber: formattedPhoneNumber,
          message:
            "🎉 Test from WoltFlow! This message was sent using Sender ID. SMS notifications are working!",
          senderID: "WoltFlow",
          smsType: "Transactional",
        });
        break;

      case "longCode":
        if (!longCodeNumber) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              success: false,
              error: "Long code number is required for longCode method",
            }),
          };
        }
        testDescription = `Long Code (${longCodeNumber})`;
        result = await sendSmsByLongCode({
          phoneNumber: formattedPhoneNumber,
          message:
            "📱 Test from WoltFlow! This message was sent using a dedicated Long Code number. SMS notifications are working!",
          originationNumber: longCodeNumber,
          smsType: "Transactional",
        });
        break;

      case "sharedNumber":
        testDescription = "Shared Number";
        result = await sendSmsBySharedNumber({
          phoneNumber: formattedPhoneNumber,
          message:
            "🔄 Test from WoltFlow! This message was sent using AWS Shared Numbers. SMS notifications are working!",
          smsType: "Transactional",
        });
        break;

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error:
              "Invalid method. Use 'senderID', 'longCode', or 'sharedNumber'",
          }),
        };
    }

    if (!result.success) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: result.error || "Failed to send SMS",
          method: result.method,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Test SMS sent successfully via ${testDescription}!`,
        messageId: result.messageId,
        phoneNumber: formattedPhoneNumber,
        method: result.method,
        testDescription,
      }),
    };
  } catch (error) {
    console.error("Error sending test SMS:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Failed to send SMS",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
