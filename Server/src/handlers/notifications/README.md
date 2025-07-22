# 2FA Notification System

This directory contains the backend implementation for the two-factor authentication (2FA) notification system for WoltFlow.

## Overview

The 2FA system allows users to verify their phone numbers and email addresses for receiving notifications from the automation system. It supports both SMS and email verification channels.

## Database Schema

### TwoFA Model (`/models/TwoFA.ts`)

- `id` (UUID): Unique session identifier
- `userId` (String): Reference to the user
- `method` (Enum): 'sms' or 'email'
- `contact` (String): Phone number (E.164 format) or email address
- `code` (String): 6-digit verification code
- `expiresAt` (Date): Code expiration time (5 minutes from creation)
- `verified` (Boolean): Whether the code was successfully verified

### Updated Settings Model (`/models/Setting.ts`)

Added new fields:

- `notificationMethod`: 'sms' | 'email' | null
- `phoneNumber`: string | null
- `phoneVerified`: boolean
- `email`: string | null
- `emailVerified`: boolean

## API Endpoints

### 1. Start 2FA Verification

**POST** `/api/setting/2FA/start`

Request body:

```json
{
  "method": "sms" | "email",
  "contact": "+972501234567" | "user@example.com"
}
```

Response:

```json
{
  "success": true,
  "message": "Verification code sent via sms",
  "sessionId": "<uuid>"
}
```

### 2. Verify 2FA Code

**POST** `/api/setting/2FA/code`

Request body:

```json
{
  "method": "sms" | "email",
  "code": "123456",
  "sessionId": "<uuid>" // optional
}
```

Response:

```json
{
  "success": true,
  "message": "Verification successful",
  "contact": "+972501234567"
}
```

### 3. Save Notification Settings

**POST** `/api/setting/notification`

Request body:

```json
{
  "notificationMethod": "sms" | "email" | null,
  "phoneNumber": "+972501234567" | null,
  "phoneVerified": true,
  "email": "user@example.com" | null,
  "emailVerified": true
}
```

## Features

### Security Features

- **Rate Limiting**: 1 request per 30 seconds per user+method
- **Code Expiration**: Codes expire after 5 minutes
- **Contact Validation**: Phone numbers (E.164) and email format validation
- **Session Management**: UUID-based session tracking
- **Tampering Detection**: Verification resets if contact changes

### Email Template

- Professional HTML email template (`/templates/2FA/index.html`)
- WoltFlow branding and styling
- Mobile-responsive design
- Security warnings and instructions
- Template variables: `{{VERIFICATION_CODE}}`, `{{METHOD_DISPLAY}}`

### Automated Cleanup

- **Scheduled Cleanup**: Runs every hour via CloudWatch Events
- Removes expired codes automatically
- Cleans up verified codes older than 24 hours
- Keeps database performance optimal

## Implementation Details

### Phone Number Handling

- Accepts multiple formats: "+972501234567", "050-123-4567", "0501234567"
- Automatically formats to E.164 international format
- Default country code: Israel (+972)

### Email Handling

- Validates email format using RFC-compliant regex
- Normalizes emails (trim, lowercase)
- Uses AWS SES for delivery

### Error Handling

- Comprehensive input validation
- Rate limiting with clear error messages
- Detailed logging for debugging
- Graceful error responses

## Usage Flow

1. User enters phone/email in settings dialog
2. Client calls `/api/setting/2FA/start`
3. User receives SMS/email with 6-digit code
4. User enters code, client calls `/api/setting/2FA/code`
5. On success, client calls `/api/setting/notification` to save
6. Settings are updated with verified contact information

## Dependencies

- **AWS SNS**: SMS delivery
- **AWS SES**: Email delivery
- **Sequelize**: Database ORM
- **Authentication**: Uses existing auth middleware
- **Templates**: File system template loading

## Deployment

The handlers are automatically deployed with the serverless application:

- `start2FA`: Handles verification code generation and sending
- `verify2FA`: Handles code verification
- `saveNotificationSettings`: Saves verified contact information
- `cleanup2FA`: Scheduled cleanup of expired codes

## Environment Variables

Inherits from main serverless configuration:

- AWS region and credentials
- Database connection
- SES/SNS configuration
