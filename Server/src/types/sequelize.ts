import {
  type CibusSettings,
  type NotificationSettings,
  type Run,
  type RunSettings,
  type Settings,
  type User,
  type WoltSettings,
  type Inbox,
  type Emails,
  type Screenshot,
  type Code,
  type Cibus2FA,
  type TwoFactorAuthentication,
} from "../models/index.js";
// Define the nested structure type for User with Settings
export type UserWithRunSettingsAndNotificationSettings = User & {
  settings: Settings & {
    runSettings: RunSettings;
    notificationSettings: NotificationSettings;
  };
};

export type RunWithUserWithWoltSettings = Run & {
  user: User & {
    settings: Settings & {
      woltSettings: WoltSettings;
    };
  };
};

export type RunWithUserWithWoltSettingsAndCibusSettingsAndRunSettings = Run & {
  user: User & {
    settings: Settings & {
      woltSettings: WoltSettings;
      cibusSettings: CibusSettings;
      runSettings: RunSettings;
    };
  };
};

export type SettingsWithUserAndNotificationSettings = Settings & {
  user: User;
  notificationSettings: NotificationSettings;
};
export type SettingsWithCibusSettings = Settings & {
  cibusSettings: CibusSettings;
};
export type SettingsWithNotificationSettings = Settings & {
  notificationSettings: NotificationSettings;
};
export type SettingsWithRunSettings = Settings & {
  runSettings: RunSettings;
};

export type SettingsWithWoltSettings = Settings & {
  woltSettings: WoltSettings;
};

export type RunWithUserWithInbox = Run & {
  user: User & {
    inbox: Inbox;
  };
};
export type EmailsWithInbox = Emails & {
  inbox: Inbox;
};
export type InboxWithUser = Inbox & {
  user: User;
};
export type RunWithScreenshots = Run & {
  screenshots: Screenshot[];
};

// Export types for comprehensive user data export
export interface CompleteUserExport {
  user: User;
  settings: Settings | null;
  notificationSettings: NotificationSettings | null;
  woltSettings: WoltSettings | null;
  cibusSettings: CibusSettings | null;
  runSettings: RunSettings | null;
  twoFactorAuthentications: TwoFactorAuthentication[];
  inbox: Inbox | null;
  emails: Emails[];
  runs: Run[];
  screenshots: Screenshot[];
  codes: Code[];
  cibus2FAcodes: Cibus2FA[];
}

export interface ExportResponse {
  success: boolean;
  message: string;
  data: CompleteUserExport;
}
