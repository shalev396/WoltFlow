// ============================================================================
// SETTINGS TYPES
// ============================================================================
// Types related to user settings: notification, Wolt, and run settings

// ============================================================================
// MAIN SETTINGS HUB
// ============================================================================
// Main settings hub that connects to all other settings - matches backend Settings model
export interface Settings {
  id: string; // UUID
  userId: string; // Foreign key to Users table
  notificationSettingsId: string | null; // Foreign key to NotificationSettings table
  woltSettingsId: string | null; // Foreign key to WoltSettings table
  runSettingsId: string | null; // Foreign key to RunSettings table
  createdAt: Date;
  updatedAt: Date;
}

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
// RUN SETTINGS
// ============================================================================
export interface RunSettings {
  id: string; // UUID
  automationEnabled: boolean;
  automationMode: "full-run" | "buy-only" | "cross-account";
  giftAmount: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RunSettingsUpdate {
  automationEnabled?: boolean;
  automationMode?: "full-run" | "buy-only" | "cross-account";
  giftAmount?: number | null;
}
