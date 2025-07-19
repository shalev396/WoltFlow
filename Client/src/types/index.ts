export interface Run {
  id?: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  status: "failed" | "in progress" | "success";
  stage:
    | "triggered"
    | "refreshing tokens"
    | "buying gift"
    | "getting code from mail"
    | "applying gift"
    | "done";
  amount: number;
  is_notify: boolean;
  mode: "full-run" | "buy-only" | "cross-account";
}

export interface Screenshot {
  id?: number;
  run_id: number;
  url: string;
  is_error: boolean;
}

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

export interface UserSettings {
  settingsId: number;
  userId: string;
  isNotification: boolean;
  hasGmailAccess: boolean; // Whether user granted Gmail access during OAuth
  automationEnabled: boolean; // Whether automation is enabled
  automationMode: "full-run" | "buy-only" | "cross-account"; // Automation mode
  cookies: string | null; // deprecated
  wrtoken: string | null;
  wtoken: string | null;
  cibusName: string | null;
  cibusPassword: string | null;
  cibusCompany: string | null;
  giftAmount: string | null; // Server returns as string "35.00"
  createdAt: Date;
  updatedAt: Date;
}

export type UserSettingsUpdate = Partial<
  Omit<UserSettings, "settingsId" | "userId" | "createdAt" | "updatedAt">
>;

export type FormSettings = {
  isNotification: boolean;
  hasGmailAccess: boolean;
  automationEnabled: boolean;
  automationMode: "full-run" | "buy-only" | "cross-account";
  wrtoken: string;
  wtoken: string;
  cibusName: string;
  cibusPassword: string;
  cibusCompany: string;
  giftAmount: number;
};
