import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyResult,
} from "aws-lambda";
import {
  sendSmsBySenderID,
  sendSmsByLongCode,
  sendSmsBySharedNumber,
  formatPhoneNumber,
} from "../../utils/smsUtil.js";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/responseUtil.js";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Check if SMS is enabled via environment variable
    const enabledSMS = process.env.ENABLED_SMS;
    if (!enabledSMS) {
      console.log(
        `Test SMS was not sent because SMS is disabled via environment variable (enabledSMS=${process.env.ENABLED_SMS})`
      );
      return createErrorResponse(
        "SMS functionality is currently disabled",
        400
      );
    }

    // Parse the request body to get the phone number and test method
    const body = event.body ? JSON.parse(event.body) : {};
    const phoneNumber = body.phoneNumber;
    const method = body.method || "senderID"; // Default to senderID
    const longCodeNumber = body.longCodeNumber; // Required for longCode method

    if (!phoneNumber) {
      return createErrorResponse("Phone number is required", 400);
    }

    // Format phone number to international format if needed (default to Israel +972)
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    if (!formattedPhoneNumber) {
      return createErrorResponse(
        "Invalid phone number format. Please provide a valid phone number.",
        400
      );
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
          return createErrorResponse(
            "Long code number is required for longCode method",
            400
          );
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
        return createErrorResponse(
          "Invalid method. Use 'senderID', 'longCode', or 'sharedNumber'",
          400
        );
    }

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to send SMS", 500);
    }

    return createSuccessResponse(
      `Test SMS sent successfully via ${testDescription}!`,
      {
        messageId: result.messageId,
        phoneNumber: formattedPhoneNumber,
        method: result.method,
        testDescription,
      }
    );
  } catch (error) {
    console.error("Error sending test SMS:", error);
    return createErrorResponse("Failed to send SMS");
  }
};
