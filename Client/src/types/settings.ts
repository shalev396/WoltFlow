// ============================================================================
// SETTINGS TYPES
// ============================================================================
// Types related to user settings: notification, Wolt, Cibus, and run settings

// ============================================================================
// NOTIFICATION SETTINGS
// ============================================================================
export interface NotificationSettings {
  id: string; // UUID
  isEnabled: boolean;
  notificationOnSuccess: boolean;
  notificationOnError: boolean;
  notificationMethod: "sms" | "email" | "both" | null;
  phoneNumber: string | null;
  phoneVerified: boolean;
  email: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationSettingsUpdate {
  isEnabled?: boolean;
  notificationOnSuccess?: boolean;
  notificationOnError?: boolean;
  notificationMethod?: "sms" | "email" | "both" | null;
  phoneNumber?: string | null;
  phoneVerified?: boolean;
  email?: string | null;
  emailVerified?: boolean;
}

// ============================================================================
// WOLT SETTINGS
// ============================================================================
export interface WoltSettings {
  id: string; // UUID
  woltRefreshToken: string | null;
  woltAccessToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WoltSettingsUpdate {
  woltRefreshToken?: string | null;
  woltAccessToken?: string | null;
}

// ============================================================================
// CIBUS SETTINGS
// ============================================================================
export interface CibusSettings {
  id: string; // UUID
  cibusUsername: string | null;
  cibusPassword: string | null;
  cibusCompany: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CibusSettingsUpdate {
  cibusUsername?: string | null;
  cibusPassword?: string | null;
  cibusCompany?: string | null;
}

// ============================================================================
// RUN SETTINGS
// ============================================================================
export interface RunSettings {
  id: string; // UUID
  automationMode: "full-run" | "buy-only" | "cross-account";
  giftAmount: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RunSettingsUpdate {
  automationMode?: "full-run" | "buy-only" | "cross-account";
  giftAmount?: number | null;
}
