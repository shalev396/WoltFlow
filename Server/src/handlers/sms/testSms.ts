import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { sendSms, formatPhoneNumber } from "../../utils/smsUtil.js";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Test SMS Handler - Event:", JSON.stringify(event, null, 2));

  try {
    // Parse the request body to get the phone number
    const body = event.body ? JSON.parse(event.body) : {};
    let phoneNumber = body.phoneNumber;

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

    // Send SMS using the utility function
    const message =
      "Hey! This is a test message from WoltFlow. SMS notifications are working! 🎉";
    const result = await sendSms({
      phoneNumber: formattedPhoneNumber,
      message,
      senderID: "WoltFlow",
      smsType: "Transactional",
    });

    if (!result.success) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: result.error || "Failed to send SMS",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Test SMS sent successfully!",
        messageId: result.messageId,
        phoneNumber: formattedPhoneNumber,
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
