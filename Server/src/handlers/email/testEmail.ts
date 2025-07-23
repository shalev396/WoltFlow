import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { sendEmail, normalizeEmail } from "../../utils/emailUtil.js";
import "../../config/bootstrap.js";
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Test Email Handler - Event:", JSON.stringify(event, null, 2));

  try {
    // Parse the request body to get the email address
    const body = event.body ? JSON.parse(event.body) : {};
    let recipientEmail = body.email || body.recipientEmail;

    if (!recipientEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Email address is required",
        }),
      };
    }

    // Normalize and validate email address
    const normalizedEmail = normalizeEmail(recipientEmail);
    if (!normalizedEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error:
            "Invalid email address format. Please provide a valid email address.",
        }),
      };
    }

    // Prepare email content
    const subject = "Test Email from WoltFlow";
    const textBody = `Hey! This is a test message from WoltFlow.
    
Email notifications are working! 🎉

This is a test email to verify that our email system is functioning correctly.

Best regards,
The WoltFlow Team`;

    const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Test Email from WoltFlow</h2>
          <p>Hey! This is a test message from WoltFlow.</p>
          <p style="font-size: 18px;">Email notifications are working! 🎉</p>
          <p>This is a test email to verify that our email system is functioning correctly.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            The WoltFlow Team
          </p>
        </div>
      </body>
    </html>
    `;

    // Send email using the utility function
    const result = await sendEmail({
      to: normalizedEmail,
      subject,
      htmlBody,
      textBody,
    });

    if (!result.success) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: result.error || "Failed to send email",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Test email sent successfully!",
        messageId: result.messageId,
        recipientEmail: normalizedEmail,
      }),
    };
  } catch (error) {
    console.error("Error sending test email:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
