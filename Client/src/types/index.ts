export interface Run {
  id?: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  status: "failed" | "in progress" | "success";
  amount: number;
  is_notify: boolean;
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
  woltAccessToken: string | null;
  woltRefreshToken: string | null;
  cibusName: string | null;
  cibusPassword: string | null;
  cibusCompany: string | null;
  giftAmount: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserSettingsUpdate = Partial<
  Omit<UserSettings, "settingsId" | "userId" | "createdAt" | "updatedAt">
>;

export type FormSettings = {
  isNotification: boolean;
  woltAccessToken: string;
  woltRefreshToken: string;
  cibusName: string;
  cibusPassword: string;
  cibusCompany: string;
  giftAmount: number;
};
