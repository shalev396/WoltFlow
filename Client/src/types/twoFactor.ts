// ============================================================================
// TWO-FACTOR AUTHENTICATION TYPES
// ============================================================================
// Types related to two-factor authentication for phone/email verification

export interface Start2FARequest {
  method: "sms" | "email";
  contact: string;
}

export interface Verify2FARequest {
  method: "sms" | "email";
  code: string;
  sessionId?: string;
}

export interface TwoFactorResponse {
  sessionId?: string;
  contact?: string;
}

// Two-factor authentication model - matches backend TwoFactorAuthentication schema
export interface TwoFactorAuthentication {
  id: string; // UUID
  notificationSettingsId: string; // Foreign key to NotificationSettings
  method: "sms" | "email"; // Verification method
  contact: string; // E.164 phone number or email address
  code: string; // 6-digit verification code
  purpose:
    | "phone_verification"
    | "email_verification"
    | "login"
    | "sensitive_action"; // Purpose of the 2FA
  expiresAt: Date; // When the code expires
  verified: boolean; // Whether the code has been used/verified
  dataExpiresAt: Date; // Data retention expiry (daily purge)
  createdAt: Date;
  updatedAt: Date;
}

// Cibus 2FA model - matches backend Cibus2FA schema
export interface Cibus2FA {
  id: string; // UUID
  userId: string; // Foreign key to Users table
  code: string; // 6-digit verification code from SMS
  message: string | null; // Original SMS message content
  receivedAt: Date; // When the SMS was received
  expiresAt: Date; // When the code expires (10 minutes after receivedAt)
  isUsed: boolean; // Whether the code has been used
  usedAt: Date | null; // When the code was used
  dataExpiresAt: Date; // Data retention expiry (daily purge)
  createdAt: Date;
  updatedAt: Date;
}
