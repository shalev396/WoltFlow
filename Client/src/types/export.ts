// Frontend types for user data export
// Uses existing organized types with Date fields converted to strings for JSON serialization

import type {
  User,
  Settings,
  NotificationSettings,
  WoltSettings,
  CibusSettings,
  RunSettings,
  TwoFactorAuthentication,
  Cibus2FA,
  Inbox,
  Email,
  Run,
  Screenshot,
  Code,
} from "@/types";

// Utility type to convert Date fields to string for JSON serialization
type DateToString<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Date | null
    ? string | null
    : T[K];
};

// Export types (Date fields converted to strings for JSON serialization)
export type ExportUser = DateToString<User>;
export type ExportSettings = DateToString<Settings>;
export type ExportNotificationSettings = DateToString<NotificationSettings>;
export type ExportWoltSettings = DateToString<WoltSettings>;
export type ExportCibusSettings = DateToString<CibusSettings>;
export type ExportRunSettings = DateToString<RunSettings>;
export type ExportTwoFactorAuthentication =
  DateToString<TwoFactorAuthentication>;
export type ExportCibus2FA = DateToString<Cibus2FA>;
export type ExportInbox = DateToString<Inbox>;
export type ExportEmail = DateToString<Email>;
export type ExportRun = DateToString<Run>;
export type ExportScreenshot = DateToString<Screenshot>;
export type ExportCode = DateToString<Code>;

// Complete user export interface
export interface CompleteUserExport {
  user: ExportUser;
  settings: ExportSettings | null;
  notificationSettings: ExportNotificationSettings | null;
  woltSettings: ExportWoltSettings | null;
  cibusSettings: ExportCibusSettings | null;
  runSettings: ExportRunSettings | null;
  twoFactorAuthentications: ExportTwoFactorAuthentication[];
  inbox: ExportInbox | null;
  emails: ExportEmail[];
  runs: ExportRun[];
  screenshots: ExportScreenshot[];
  codes: ExportCode[];
  cibus2FAcodes: ExportCibus2FA[];
}

export interface ExportResponse {
  success: boolean;
  message: string;
  data: CompleteUserExport;
}

// CSV row types for flattened data structure
export interface CSVRow {
  [key: string]: string | number | boolean | null;
}

export interface CSVExportData {
  headers: string[];
  rows: CSVRow[];
}
