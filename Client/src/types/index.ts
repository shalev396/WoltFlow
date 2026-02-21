// Response envelope -- from the middleware's type system (single source of truth)
export type {
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiResponse,
} from "@server/types/response";

// Auth route types
export type {
  SignupRequestBody,
  SignupResponseData,
  ConfirmSignupRequestBody,
  LoginRequestBody,
  LoginResponseData,
  ForgotPasswordRequestBody,
  ResetPasswordRequestBody,
  RefreshTokenRequestBody,
  RefreshTokenResponseData,
} from "@server/routes/auth/index";

// Account route types
export type {
  ExportUserDataResponseData,
  DeleteUserResponseData,
} from "@server/routes/user/account";

// Dashboard route types
export type { DashboardResponseData } from "@server/routes/user/dashboard";

// Inbox route types
export type {
  InboxResponseData,
  DownloadAttachmentResponseData,
} from "@server/routes/user/inbox";

// Runs route types
export type { RunsResponseData } from "@server/routes/user/runs";

// Settings route types
export type {
  NotificationSettingsResponseData,
  UpdateNotificationSettingsRequestBody,
  Start2FARequestBody,
  Start2FAResponseData,
  Verify2FARequestBody,
  Verify2FAResponseData,
  RunSettingsResponseData,
  UpdateRunSettingsRequestBody,
  WoltSettingsResponseData,
  UpdateWoltSettingsRequestBody,
} from "@server/routes/user/settings";

// Convenience aliases for deeply nested server response sub-types
import type { DashboardResponseData } from "@server/routes/user/dashboard";
import type { RunsResponseData } from "@server/routes/user/runs";
import type { InboxResponseData } from "@server/routes/user/inbox";
import type { LoginResponseData } from "@server/routes/auth/index";

export type DashboardAnalytics = DashboardResponseData["analytics"];
export type RunItem = RunsResponseData["runs"][number];
export type ScreenshotItem = RunItem["screenshots"][number];
export type EmailItem = InboxResponseData["emails"][number];
export type AppUser = LoginResponseData["user"];

// ============================================================================
// CLIENT-ONLY TYPES (UI state, not API contracts)
// ============================================================================

export type TimeRange = "7d" | "30d" | "90d";

export interface InboxFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface RunFilters {
  status?: string;
  stage?: string;
  automationMode?: string;
}
