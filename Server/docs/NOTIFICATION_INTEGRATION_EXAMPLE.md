# Notification Utility Integration Examples

This document shows how to integrate the new notification utility functions into existing error handling.

## Overview

The notification utility provides two main functions:

1. `getUserNotificationDetails(userId)` - Gets user's notification preferences and verified methods
2. `notifyOnError(userId, runId, errorMessage?)` - Sends error notifications via user's preferred methods

## Integration Examples

### 1. Refresh Tokens Handler (refreshTokens.ts)

Replace the TODO comment at line 118 with actual notification:

```typescript
import { notifyOnError } from "../../utils/notificationUtil.js";

// In the catch block around line 118:
} catch (refreshError: any) {
  console.error("Token refresh failed:", refreshError);
  if (run) {
    await run.update({ status: "failed" });

    // Send error notification to user
    try {
      await notifyOnError(run.user_id, run.id, "Token refresh failed");
    } catch (notificationError) {
      console.error("Failed to send error notification:", notificationError);
    }
  }
  // ... rest of error handling
}
```

### 2. Wolt Buy Gift Handler (woltBuyGift.ts)

Add notification in the error handling section:

```typescript
import { notifyOnError } from "../../utils/notificationUtil.js";

// In the finally block around line 464:
} else {
  console.log("Gift purchase failed, skipping getDailyCode trigger");
  if (run && !success) {
    await run.update({ status: "failed" });

    // Send error notification to user
    try {
      await notifyOnError(run.user_id, run.id, "Gift purchase failed");
    } catch (notificationError) {
      console.error("Failed to send error notification:", notificationError);
    }
  }
}
```

### 3. Wolt Apply Gift Handler (woltApplyGift.ts)

Add notification when gift application fails:

```typescript
import { notifyOnError } from "../../utils/notificationUtil.js";

// In the finally block around line 210:
if (run) {
  if (success) {
    await run.update({ status: "success", stage: "done" });
  } else {
    await run.update({ status: "failed" });

    // Send error notification to user
    try {
      await notifyOnError(run.user_id, run.id, "Gift card redemption failed");
    } catch (notificationError) {
      console.error("Failed to send error notification:", notificationError);
    }
  }
}
```

## Usage Examples

### Basic Usage

```typescript
import {
  getUserNotificationDetails,
  notifyOnError,
} from "../utils/notificationUtil.js";

// Check user's notification preferences
const userNotifications = await getUserNotificationDetails("user123");
console.log("Has notifications:", userNotifications.hasNotifications);
console.log("Preferred methods:", userNotifications.preferredMethods);

// Send error notification
const result = await notifyOnError("user123", 456, "Custom error message");
console.log("Notification sent successfully:", result.success);
console.log("Methods used:", result.sentMethods);
if (!result.success) {
  console.log("Errors:", result.errors);
}
```

### Advanced Usage - Manual Notification

```typescript
import { getUserNotificationDetails } from "../utils/notificationUtil.js";
import { sendEmail } from "../utils/emailUtil.js";
import { sendSmsBySenderID } from "../utils/smsUtil.js";

async function sendCustomNotification(userId: string, message: string) {
  const userDetails = await getUserNotificationDetails(userId);

  if (!userDetails.hasNotifications) {
    console.log("User has notifications disabled");
    return;
  }

  // Send via SMS if available
  if (userDetails.preferredMethods.includes("sms") && userDetails.phoneNumber) {
    await sendSmsBySenderID({
      phoneNumber: userDetails.phoneNumber,
      message: `WoltFlow Alert: ${message}`,
      senderID: "WoltFlow",
    });
  }

  // Send via email if available
  if (userDetails.preferredMethods.includes("email") && userDetails.email) {
    await sendEmail({
      to: userDetails.email,
      subject: "WoltFlow Alert",
      textBody: message,
    });
  }
}
```

## Features

### Error Email Template

The error notification email includes:

- Professional WoltFlow branding with error theme (red)
- Complete run details (ID, status, stage, mode, amount, timestamps)
- Screenshots (both regular and error screenshots)
- Support contact information
- Mobile-responsive design
- Dark mode support

### SMS Notifications

SMS notifications include:

- Run ID and basic details
- Current stage and mode
- Error message (if provided)
- Support contact

### Automatic Method Selection

The system automatically:

- Checks if notifications are enabled for the user
- Verifies which contact methods are verified (SMS/email)
- Sends notifications via all verified methods
- Handles errors gracefully if sending fails
- Logs all notification attempts

## Error Handling

All notification functions include comprehensive error handling:

- Database connection issues
- Invalid user IDs
- Missing or unverified contact information
- Email/SMS service failures
- Template loading errors

Notifications will never cause the main automation to fail - they're designed to be resilient and non-blocking.

## Implementation Status

✅ **Completed Integration**: All automation functions now have error notifications implemented:

### 1. refreshTokens.ts ✅

- **Line 121**: Token refresh failure notification
- **Line 150**: General automation error notification
- **Import added**: `notifyOnError` from `../../utils/notificationUtil.js`

### 2. woltApplyGift.ts ✅

- **Line 215**: Gift card redemption failure notification
- **Import added**: `notifyOnError` from `../../utils/notificationUtil.js`

### 3. woltBuyGift.ts ✅

- **Line 470**: Gift purchase failure notification
- **Import added**: `notifyOnError` from `../../utils/notificationUtil.js`

### 4. getDailyCode.ts ✅

- **Line 105**: User not found notification
- **Line 194**: No Wolt email found notification
- **Line 229**: PDF attachment not found notification
- **Line 255**: Code not found in PDF notification
- **Line 313**: General email processing failure notification
- **Import added**: `notifyOnError` from `../../utils/notificationUtil.js`

### 5. startUserAutomationChain.ts ✅

- **Line 106**: Automation setup failure notification for individual users
- **Import added**: `notifyOnError` from `../../utils/notificationUtil.js`

All automation functions will now automatically send professional error notifications (both SMS and email) to users when failures occur, including:

- Complete run details (ID, status, stage, mode, amount, timestamps)
- Screenshots (when available)
- Support contact information
- User-friendly error messages

The notifications are sent only to users who have:

- Notifications enabled (`isNotification: true`)
- Verified contact methods (phone/email with `phoneVerified: true` or `emailVerified: true`)

All notification attempts are logged and handled gracefully - they will never cause the main automation to fail.
