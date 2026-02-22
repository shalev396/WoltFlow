import { User, Run } from "../classes/index.js";
import type {
  UserNotificationDetails,
  RunForNotification,
  ScreenshotForNotification,
} from "../classes/index.js";
import { sendEmail, type SendEmailResult } from "./emailUtil.js";
import { sendSmsBySenderID, type SendSmsResult } from "./smsUtil.js";
import fs from "fs/promises";
import path from "path";

const SENDER_DOMAIN = process.env.DOMAIN_NAME?.includes("localhost")
  ? "dev.woltflow.shalev396.com"
  : process.env.DOMAIN_NAME;
const ALERT_SENDER_EMAIL = `alert@${SENDER_DOMAIN}`;
const ALERT_SENDER_NAME = "WoltFlow Alert System";

export interface NotifyOnResult {
  success: boolean;
  sentMethods: "sms" | "email" | null;
  errors: string[];
}

/**
 * Send error notification to user using their preferred verified method(s)
 * @param userId User ID to send notification to
 * @param runId Run ID that failed
 * @param errorMessage Optional custom error message
 * @returns Promise with notification result
 */
export async function notifyOnError(
  userId: string,
  runId: string,
  errorMessage?: string,
): Promise<NotifyOnResult> {
  const result: NotifyOnResult = {
    success: false,
    sentMethods: null,
    errors: [],
  };

  try {
    const userNotificationDetails = await User.getNotificationDetails(userId);

    if (!userNotificationDetails) {
      console.log(`No notification settings found for user ${userId}`);
      result.errors.push("No notification settings found for this user");
      return result;
    }

    if (!userNotificationDetails.notificationSettings) {
      console.log(`No notification settings object found for user ${userId}`);
      result.errors.push("Notification settings object not found");
      return result;
    }

    if (!userNotificationDetails.notificationSettings.isEnabled) {
      console.log(`User ${userId} has notifications disabled`);
      result.errors.push("Notifications are disabled for this user");
      return result;
    }

    if (!userNotificationDetails.notificationSettings.notificationOnError) {
      console.log(`User ${userId} has error notifications disabled`);
      result.errors.push("Error notifications are disabled for this user");
      return result;
    }

    if (!userNotificationDetails.notificationSettings.notificationMethod) {
      console.log(`User ${userId} has no verified notification methods`);
      result.errors.push("No verified notification methods available");
      return result;
    }

    const runData = await Run.findWithScreenshots(runId);

    if (!runData) {
      result.errors.push(`Run ${runId} not found`);
      return result;
    }

    const screenshots = runData.screenshots;

    try {
      const notificationMethod =
        userNotificationDetails.notificationSettings.notificationMethod;

      // After the null checks above, notificationSettings is guaranteed non-null
      const verifiedDetails = userNotificationDetails as UserNotificationDetails & {
        notificationSettings: NonNullable<UserNotificationDetails["notificationSettings"]>;
      };

      if (notificationMethod === "sms") {
        await sendSmsErrorNotification(
          verifiedDetails,
          runData,
          errorMessage,
        );
        result.sentMethods = "sms";
      } else if (notificationMethod === "email") {
        await sendEmailErrorNotification(
          verifiedDetails,
          runData,
          screenshots,
          errorMessage,
        );
        result.sentMethods = "email";
      }
    } catch (error) {
      const errorMsg = `Failed to send ${
        userNotificationDetails.notificationSettings.notificationMethod ||
        "unknown"
      } notification: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
      console.error(errorMsg);
      result.errors.push(errorMsg);
    }

    result.success = result.sentMethods !== null;

    if (result.success) {
      console.log(
        `Error notification sent to user ${userId} via: ${result.sentMethods}`,
      );
    } else {
      console.error(
        `Failed to send error notification to user ${userId}: ${result.errors.join(
          "; ",
        )}`,
      );
    }

    return result;
  } catch (error) {
    const errorMsg = `Error sending notification to user ${userId}: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
    console.error(errorMsg);
    result.errors.push(errorMsg);
    return result;
  }
}

/**
 * Send success notification to user using their preferred verified method(s)
 * @param userId User ID to send notification to
 * @param runId Run ID that succeeded
 * @param successMessage Optional custom success message
 * @returns Promise with notification result
 */
export async function notifyOnSuccess(
  userId: string,
  runId: string,
  successMessage?: string,
): Promise<NotifyOnResult> {
  const result: NotifyOnResult = {
    success: false,
    sentMethods: null,
    errors: [],
  };

  try {
    const userNotificationDetails = await User.getNotificationDetails(userId);

    if (!userNotificationDetails) {
      console.log(`No notification settings found for user ${userId}`);
      result.errors.push("No notification settings found for this user");
      return result;
    }

    if (!userNotificationDetails.notificationSettings) {
      console.log(`No notification settings object found for user ${userId}`);
      result.errors.push("Notification settings object not found");
      return result;
    }

    if (!userNotificationDetails.notificationSettings.isEnabled) {
      console.log(`User ${userId} has notifications disabled`);
      result.errors.push("Notifications are disabled for this user");
      return result;
    }

    if (!userNotificationDetails.notificationSettings.notificationOnSuccess) {
      console.log(`User ${userId} has success notifications disabled`);
      result.errors.push("Success notifications are disabled for this user");
      return result;
    }

    if (!userNotificationDetails.notificationSettings.notificationMethod) {
      console.log(`User ${userId} has no verified notification methods`);
      result.errors.push("No verified notification methods available");
      return result;
    }

    const runData = await Run.findWithScreenshots(runId);

    if (!runData) {
      result.errors.push(`Run ${runId} not found`);
      return result;
    }

    const screenshots = runData.screenshots;

    try {
      const notificationMethod =
        userNotificationDetails.notificationSettings.notificationMethod;

      const verifiedDetails = userNotificationDetails as UserNotificationDetails & {
        notificationSettings: NonNullable<UserNotificationDetails["notificationSettings"]>;
      };

      if (notificationMethod === "sms") {
        await sendSmsSuccessNotification(
          verifiedDetails,
          runData,
          successMessage,
        );
        result.sentMethods = "sms";
      } else if (notificationMethod === "email") {
        await sendEmailSuccessNotification(
          verifiedDetails,
          runData,
          screenshots,
          successMessage,
        );
        result.sentMethods = "email";
      }
    } catch (error) {
      const errorMsg = `Failed to send ${
        userNotificationDetails.notificationSettings.notificationMethod ||
        "unknown"
      } success notification: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
      console.error(errorMsg);
      result.errors.push(errorMsg);
    }

    result.success = result.sentMethods !== null;

    if (result.success) {
      console.log(
        `Success notification sent to user ${userId} via: ${result.sentMethods}`,
      );
    } else {
      console.error(
        `Failed to send success notification to user ${userId}: ${result.errors.join(
          "; ",
        )}`,
      );
    }

    return result;
  } catch (error) {
    const errorMsg = `Error sending success notification to user ${userId}: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
    console.error(errorMsg);
    result.errors.push(errorMsg);
    return result;
  }
}

type VerifiedNotificationDetails = UserNotificationDetails & {
  notificationSettings: NonNullable<UserNotificationDetails["notificationSettings"]>;
};

/**
 * Send SMS notification for error
 */
async function sendSmsErrorNotification(
  userDetails: VerifiedNotificationDetails,
  run: RunForNotification,
  errorMessage?: string,
): Promise<SendSmsResult> {
  if (!userDetails.notificationSettings.phoneNumber) {
    throw new Error("Phone number not available");
  }
  const message = `WoltFlow Alert 🚨

Run #${run.id} has failed
Stage: ${run.stage}
Mode: ${run.automationMode}

${errorMessage ? `Error: ${errorMessage}` : ""}

Check your dashboard for details.
Support: support@${process.env.DOMAIN_NAME}`;

  return await sendSmsBySenderID({
    phoneNumber: userDetails.notificationSettings.phoneNumber,
    message,
    senderID: "WoltFlow",
    smsType: "Transactional",
  });
}

/**
 * Send email notification for error
 */
async function sendEmailErrorNotification(
  userDetails: VerifiedNotificationDetails,
  run: RunForNotification,
  screenshots: ScreenshotForNotification[],
  errorMessage?: string,
): Promise<SendEmailResult> {
  if (!userDetails.notificationSettings.email) {
    throw new Error("Email address not available");
  }

  try {
    const templatePath = path.join(
      process.cwd(),
      "templates",
      "error",
      "index.html",
    );
    let htmlTemplate = await fs.readFile(templatePath, "utf-8");

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jerusalem",
      }).format(new Date(date));
    };

    const replacements = {
      "{{USER_NAME}}": userDetails.user.name || "User",
      "{{RUN_ID}}": run.id.toString(),
      "{{RUN_STATUS}}": run.status,
      "{{RUN_STATUS_CLASS}}": run.status.replace(" ", "-"),
      "{{RUN_STAGE}}": run.stage,
      "{{RUN_MODE}}": run.automationMode,
      "{{RUN_AMOUNT}}": run.amount ? Number(run.amount).toLocaleString() : "0",
      "{{RUN_CREATED_AT}}": formatDate(run.createdAt),
      "{{RUN_UPDATED_AT}}": formatDate(run.updatedAt),
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
      htmlTemplate = htmlTemplate.replace(new RegExp(placeholder, "g"), value);
    }

    if (screenshots && screenshots.length > 0) {
      htmlTemplate = htmlTemplate.replace("{{#if HAS_SCREENSHOTS}}", "");
      htmlTemplate = htmlTemplate.replace("{{/if}}", "");

      let screenshotsHtml = "";
      screenshots.forEach((screenshot) => {
        const screenshotHtml = `
          <div class="screenshot-container">
            <div class="screenshot-header ${
              screenshot.isError ? "screenshot-error" : "screenshot-normal"
            }">
              ${
                screenshot.isError ? "❌ Error Screenshot" : "📋 Run Screenshot"
              }
            </div>
            <img src="${screenshot.screenshotUrl}" alt="${
              screenshot.isError ? "Error Screenshot" : "Run Screenshot"
            }" class="screenshot-image">
          </div>`;
        screenshotsHtml += screenshotHtml;
      });

      htmlTemplate = htmlTemplate.replace("{{#each SCREENSHOTS}}", "");
      htmlTemplate = htmlTemplate.replace("{{/each}}", screenshotsHtml);
    } else {
      const noScreenshotsMessage = `
        <div class="screenshots-section">
          <div class="screenshots-title">📸 Screenshots</div>
          <div class="screenshot-container">
            <div class="screenshot-header screenshot-normal">
              📋 No Screenshots Available
            </div>
            <div style="padding: 20px; text-align: center; color: #71717a; font-style: italic;">
              No screenshots were captured for this run. This may occur when errors happen before the automation process begins.
            </div>
          </div>
        </div>`;

      const screenshotsSection = htmlTemplate.match(
        /{{#if HAS_SCREENSHOTS}}[\s\S]*?{{\/if}}/,
      );
      if (screenshotsSection) {
        htmlTemplate = htmlTemplate.replace(
          screenshotsSection[0],
          noScreenshotsMessage,
        );
      }
    }
    const textBody = `WoltFlow Error Notification

Hello ${userDetails.user.name || "User"},

Your WoltFlow automation run has encountered an error.

Run Details:
- Run ID: #${run.id}
- Status: ${run.status}
- Current Stage: ${run.stage}
- Mode: ${run.automationMode}
- Amount: ₪${run.amount ? Number(run.amount).toLocaleString() : "0"}
- Started: ${formatDate(run.createdAt)}
- Last Updated: ${formatDate(run.updatedAt)}

${errorMessage ? `Error Message: ${errorMessage}` : ""}

${
  screenshots && screenshots.length > 0
    ? `Screenshots are available in the web version of this email.`
    : ""
}

If this error persists, please contact our support team with the run ID for assistance.

Support: support@${process.env.DOMAIN_NAME}

© 2025 WoltFlow. Streamlining your Wolt experience.`;

    return await sendEmail({
      to: userDetails.notificationSettings.email,
      subject: `🚨 WoltFlow Error - Run #${run.id} Failed`,
      htmlBody: htmlTemplate,
      textBody,
      fromName: ALERT_SENDER_NAME,
      from: ALERT_SENDER_EMAIL,
    });
  } catch (error) {
    console.error("Error creating email notification:", error);
    throw error;
  }
}

/**
 * Send SMS notification for success
 */
async function sendSmsSuccessNotification(
  userDetails: VerifiedNotificationDetails,
  run: RunForNotification,
  successMessage?: string,
): Promise<SendSmsResult> {
  if (!userDetails.notificationSettings.phoneNumber) {
    throw new Error("Phone number not available");
  }
  const message = `WoltFlow Success 🎉

Run #${run.id} completed successfully!
Stage: ${run.stage}
Mode: ${run.automationMode}

${successMessage ? `Message: ${successMessage}` : ""}

Your gift card has been redeemed and is ready to use!
Dashboard: ${process.env.DOMAIN_NAME}/dashboard`;

  return await sendSmsBySenderID({
    phoneNumber: userDetails.notificationSettings.phoneNumber,
    message,
    senderID: "WoltFlow",
    smsType: "Transactional",
  });
}

/**
 * Send email notification for success
 */
async function sendEmailSuccessNotification(
  userDetails: VerifiedNotificationDetails,
  run: RunForNotification,
  screenshots: ScreenshotForNotification[],
  successMessage?: string,
): Promise<SendEmailResult> {
  if (!userDetails.notificationSettings.email) {
    throw new Error("Email address not available");
  }

  try {
    const templatePath = path.join(
      process.cwd(),
      "templates",
      "success",
      "index.html",
    );
    let htmlTemplate = await fs.readFile(templatePath, "utf-8");

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jerusalem",
      }).format(new Date(date));
    };

    const replacements = {
      "{{USER_NAME}}": userDetails.user.name || "User",
      "{{RUN_ID}}": run.id.toString(),
      "{{RUN_STATUS}}": run.status,
      "{{RUN_STATUS_CLASS}}": run.status.replace(" ", "-"),
      "{{RUN_STAGE}}": run.stage,
      "{{RUN_MODE}}": run.automationMode,
      "{{RUN_AMOUNT}}": run.amount ? Number(run.amount).toLocaleString() : "0",
      "{{RUN_CREATED_AT}}": formatDate(run.createdAt),
      "{{RUN_UPDATED_AT}}": formatDate(run.updatedAt),
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
      htmlTemplate = htmlTemplate.replace(new RegExp(placeholder, "g"), value);
    }

    if (screenshots && screenshots.length > 0) {
      htmlTemplate = htmlTemplate.replace("{{#if HAS_SCREENSHOTS}}", "");
      htmlTemplate = htmlTemplate.replace("{{/if}}", "");

      let screenshotsHtml = "";
      screenshots.forEach((screenshot) => {
        const screenshotHtml = `
          <div class="screenshot-container">
            <div class="screenshot-header ${
              screenshot.isError ? "screenshot-normal" : "screenshot-success"
            }">
              ${
                screenshot.isError
                  ? "📋 Run Screenshot"
                  : "✅ Success Screenshot"
              }
            </div>
            <img src="${screenshot.screenshotUrl}" alt="${
              screenshot.isError ? "Run Screenshot" : "Success Screenshot"
            }" class="screenshot-image">
          </div>`;
        screenshotsHtml += screenshotHtml;
      });

      htmlTemplate = htmlTemplate.replace("{{#each SCREENSHOTS}}", "");
      htmlTemplate = htmlTemplate.replace("{{/each}}", screenshotsHtml);
    } else {
      const noScreenshotsMessage = `
        <div class="screenshots-section">
          <div class="screenshots-title">📸 Screenshots</div>
          <div class="screenshot-container">
            <div class="screenshot-header screenshot-success">
              ✅ No Screenshots Available
            </div>
            <div style="padding: 20px; text-align: center; color: #71717a; font-style: italic;">
              No screenshots were captured for this run. The automation completed successfully without needing to save screenshots.
            </div>
          </div>
        </div>`;

      const screenshotsSection = htmlTemplate.match(
        /{{#if HAS_SCREENSHOTS}}[\s\S]*?{{\/if}}/,
      );
      if (screenshotsSection) {
        htmlTemplate = htmlTemplate.replace(
          screenshotsSection[0],
          noScreenshotsMessage,
        );
      }
    }
    const textBody = `WoltFlow Success Notification

Hello ${userDetails.user.name || "User"},

Great news! Your WoltFlow automation run has completed successfully.

Run Details:
- Run ID: #${run.id}
- Status: ${run.status}
- Final Stage: ${run.stage}
- Mode: ${run.automationMode}
- Amount: ₪${run.amount ? Number(run.amount).toLocaleString() : "0"}
- Started: ${formatDate(run.createdAt)}
- Completed: ${formatDate(run.updatedAt)}

${successMessage ? `Message: ${successMessage}` : ""}

${
  screenshots && screenshots.length > 0
    ? `Screenshots are available in the web version of this email.`
    : ""
}

Your gift card has been redeemed and the credit is now available in your Wolt account. 
You can start using it for your next orders right away!

Dashboard: ${process.env.DOMAIN_NAME}/dashboard

© 2025 WoltFlow. Streamlining your Wolt experience.`;

    return await sendEmail({
      to: userDetails.notificationSettings.email,
      subject: `🎉 WoltFlow Success - Run #${run.id} Completed`,
      htmlBody: htmlTemplate,
      textBody,
      fromName: ALERT_SENDER_NAME,
      from: ALERT_SENDER_EMAIL,
    });
  } catch (error) {
    console.error("Error creating success email notification:", error);
    throw error;
  }
}
