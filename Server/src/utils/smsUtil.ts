import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from "@aws-sdk/client-sns";

// Initialize SNS client for il-central-1 region
const snsClient = new SNSClient({ region: "il-central-1" });

export interface SendSmsOptions {
  phoneNumber: string;
  message: string;
  senderID?: string;
  smsType?: "Promotional" | "Transactional";
}

export interface SendSmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send SMS using AWS SNS
 * @param options SMS sending options
 * @returns Promise with result of SMS sending
 */
export async function sendSms(options: SendSmsOptions): Promise<SendSmsResult> {
  try {
    const {
      phoneNumber,
      message,
      senderID = "WoltFlow",
      smsType = "Transactional",
    } = options;

    // Format and validate phone number
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    if (!formattedPhoneNumber) {
      return {
        success: false,
        error:
          "Invalid phone number format. Please provide a valid phone number.",
      };
    }

    // Validate message length (SMS limit is 160 characters for single SMS)
    if (message.length > 1600) {
      // Allow up to 10 concatenated SMS
      return {
        success: false,
        error: "Message is too long. Maximum 1600 characters allowed.",
      };
    }

    const publishInput: PublishCommandInput = {
      PhoneNumber: formattedPhoneNumber,
      Message: message,
      MessageAttributes: {
        "AWS.SNS.SMS.SenderID": {
          DataType: "String",
          StringValue: senderID,
        },
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: smsType,
        },
      },
    };

    const publishCommand = new PublishCommand(publishInput);
    const result = await snsClient.send(publishCommand);

    console.log(
      `SMS sent successfully to ${formattedPhoneNumber}:`,
      result.MessageId
    );

    return {
      success: true,
      messageId: result.MessageId || "unknown",
    };
  } catch (error) {
    console.error("Error sending SMS:", error);

    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Validate phone number format
 * @param phoneNumber Phone number to validate
 * @returns boolean indicating if phone number is valid
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Format phone number to international format if needed
 * @param phoneNumber Phone number to format
 * @param defaultCountryCode Default country code if not provided (e.g., "972" for Israel)
 * @returns Formatted phone number or null if invalid
 */
export function formatPhoneNumber(
  phoneNumber: string,
  defaultCountryCode: string = "972"
): string | null {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // If already has + prefix, validate and return
  if (phoneNumber.startsWith("+")) {
    return isValidPhoneNumber(phoneNumber) ? phoneNumber : null;
  }

  // If starts with 0 (local format), replace with country code
  if (cleaned.startsWith("0")) {
    const formatted = `+${defaultCountryCode}${cleaned.substring(1)}`;
    return isValidPhoneNumber(formatted) ? formatted : null;
  }

  // If no prefix, add country code
  const formatted = `+${defaultCountryCode}${cleaned}`;
  return isValidPhoneNumber(formatted) ? formatted : null;
}
