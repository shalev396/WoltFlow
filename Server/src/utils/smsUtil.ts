import {
  PinpointSMSVoiceV2Client,
  SendTextMessageCommand,
  type SendTextMessageCommandInput,
} from "@aws-sdk/client-pinpoint-sms-voice-v2";

// Initialize Pinpoint SMS Voice V2 client
const pinpointSmsClient = new PinpointSMSVoiceV2Client({
  region: process.env.AWS_REGION,
});

export interface SendSmsBySenderIDOptions {
  phoneNumber: string;
  message: string;
  senderID?: string; // Default to "WoltFlow"
  smsType?: "Promotional" | "Transactional";
}

export interface SendSmsByLongCodeOptions {
  phoneNumber: string;
  message: string;
  originationNumber: string; // The dedicated long code number
  smsType?: "Promotional" | "Transactional";
}

export interface SendSmsBySharedNumberOptions {
  phoneNumber: string;
  message: string;
  smsType?: "Promotional" | "Transactional";
}

export interface SendSmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
  method?: "senderID" | "longCode" | "sharedNumber";
}

/**
 * Send SMS using Sender ID (WoltFlow or custom)
 * @param options SMS sending options with sender ID
 * @returns Promise with result of SMS sending
 */
export async function sendSmsBySenderID(
  options: SendSmsBySenderIDOptions
): Promise<SendSmsResult> {
  try {
    // Check if SMS is enabled via environment variable
    if (!process.env.ENABLED_SMS) {
      console.log(
        `SMS was not sent because SMS is disabled via environment variable (enabledSMS=${process.env.ENABLED_SMS})`
      );
      return {
        success: false,
        error: "SMS functionality is currently disabled",
        method: "senderID",
      };
    }

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
        method: "senderID",
      };
    }

    // Validate message length
    if (message.length > 1600) {
      return {
        success: false,
        error: "Message is too long. Maximum 1600 characters allowed.",
        method: "senderID",
      };
    }

    const sendMessageInput: SendTextMessageCommandInput = {
      DestinationPhoneNumber: formattedPhoneNumber,
      MessageBody: message,
      OriginationIdentity: senderID,
      MessageType: smsType === "Promotional" ? "PROMOTIONAL" : "TRANSACTIONAL",
    };

    const sendMessageCommand = new SendTextMessageCommand(sendMessageInput);
    const result = await pinpointSmsClient.send(sendMessageCommand);

    console.log(
      `SMS sent successfully via Sender ID "${senderID}" to ${formattedPhoneNumber}:`,
      result.MessageId
    );

    return {
      success: true,
      messageId: result.MessageId || "unknown",
      method: "senderID",
    };
  } catch (error) {
    console.error("Error sending SMS via Sender ID:", error);

    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
      method: "senderID",
    };
  }
}

/**
 * Send SMS using Long Code (dedicated phone number)
 * @param options SMS sending options with origination number
 * @returns Promise with result of SMS sending
 */
export async function sendSmsByLongCode(
  options: SendSmsByLongCodeOptions
): Promise<SendSmsResult> {
  try {
    // Check if SMS is enabled via environment variable
    if (!process.env.ENABLED_SMS) {
      console.log(
        `SMS was not sent because SMS is disabled via environment variable (enabledSMS=${process.env.ENABLED_SMS})`
      );
      return {
        success: false,
        error: "SMS functionality is currently disabled",
        method: "longCode",
      };
    }

    const {
      phoneNumber,
      message,
      originationNumber,
      smsType = "Transactional",
    } = options;

    // Format and validate destination phone number
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    if (!formattedPhoneNumber) {
      return {
        success: false,
        error:
          "Invalid phone number format. Please provide a valid phone number.",
        method: "longCode",
      };
    }

    // Validate origination number format
    const formattedOriginationNumber = formatPhoneNumber(originationNumber);
    if (!formattedOriginationNumber) {
      return {
        success: false,
        error:
          "Invalid origination number format. Please provide a valid long code number.",
        method: "longCode",
      };
    }

    // Validate message length
    if (message.length > 1600) {
      return {
        success: false,
        error: "Message is too long. Maximum 1600 characters allowed.",
        method: "longCode",
      };
    }

    const sendMessageInput: SendTextMessageCommandInput = {
      DestinationPhoneNumber: formattedPhoneNumber,
      MessageBody: message,
      OriginationIdentity: formattedOriginationNumber,
      MessageType: smsType === "Promotional" ? "PROMOTIONAL" : "TRANSACTIONAL",
    };

    const sendMessageCommand = new SendTextMessageCommand(sendMessageInput);
    const result = await pinpointSmsClient.send(sendMessageCommand);

    console.log(
      `SMS sent successfully via Long Code "${formattedOriginationNumber}" to ${formattedPhoneNumber}:`,
      result.MessageId
    );

    return {
      success: true,
      messageId: result.MessageId || "unknown",
      method: "longCode",
    };
  } catch (error) {
    console.error("Error sending SMS via Long Code:", error);

    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
      method: "longCode",
    };
  }
}

/**
 * Send SMS using Shared Numbers (default AWS behavior)
 * @param options SMS sending options for shared numbers
 * @returns Promise with result of SMS sending
 */
export async function sendSmsBySharedNumber(
  options: SendSmsBySharedNumberOptions
): Promise<SendSmsResult> {
  try {
    // Check if SMS is enabled via environment variable
    const enabledSMS = process.env.ENABLED_SMS;
    if (!enabledSMS) {
      console.log(
        `SMS was not sent because SMS is disabled via environment variable (enabledSMS=${process.env.ENABLED_SMS})`
      );
      return {
        success: false,
        error: "SMS functionality is currently disabled",
        method: "sharedNumber",
      };
    }

    const { phoneNumber, message, smsType = "Transactional" } = options;

    // Format and validate phone number
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    if (!formattedPhoneNumber) {
      return {
        success: false,
        error:
          "Invalid phone number format. Please provide a valid phone number.",
        method: "sharedNumber",
      };
    }

    // Validate message length
    if (message.length > 1600) {
      return {
        success: false,
        error: "Message is too long. Maximum 1600 characters allowed.",
        method: "sharedNumber",
      };
    }

    const sendMessageInput: SendTextMessageCommandInput = {
      DestinationPhoneNumber: formattedPhoneNumber,
      MessageBody: message,
      MessageType: smsType === "Promotional" ? "PROMOTIONAL" : "TRANSACTIONAL",
      // Note: For shared numbers, we don't specify OriginationIdentity
      // AWS will use a shared pool number automatically
    };

    const sendMessageCommand = new SendTextMessageCommand(sendMessageInput);
    const result = await pinpointSmsClient.send(sendMessageCommand);

    console.log(
      `SMS sent successfully via Shared Number to ${formattedPhoneNumber}:`,
      result.MessageId
    );

    return {
      success: true,
      messageId: result.MessageId || "unknown",
      method: "sharedNumber",
    };
  } catch (error) {
    console.error("Error sending SMS via Shared Number:", error);

    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
      method: "sharedNumber",
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
