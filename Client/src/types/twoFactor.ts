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
