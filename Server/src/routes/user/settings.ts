import { Router } from "express";
import { SettingsController } from "../../controllers/index.js";

const router = Router();

export interface NotificationSettingsResponseData {
  notificationSettings: {
    id: string;
    isEnabled: boolean;
    notificationMethod: "sms" | "email" | null;
    notificationOnSuccess: boolean;
    notificationOnError: boolean;
    phoneNumber: string | null;
    phoneVerified: boolean;
    email: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

router.get("/notification", SettingsController.getNotificationSettings);

export interface UpdateNotificationSettingsRequestBody {
  isEnabled?: boolean;
  notificationMethod?: "sms" | "email";
  notificationOnSuccess?: boolean;
  notificationOnError?: boolean;
  phoneNumber?: string;
  phoneVerified?: boolean;
  email?: string;
  emailVerified?: boolean;
}

router.put("/notification", SettingsController.updateNotificationSettings);

export interface Start2FARequestBody {
  method: "sms" | "email";
  contact: string;
}

export interface Start2FAResponseData {
  sessionId: string;
}

router.post("/notification/2fa/start", SettingsController.start2FA);

export interface Verify2FARequestBody {
  method: "sms" | "email";
  code: string;
  sessionId?: string;
}

export interface Verify2FAResponseData {
  contact: string;
}

router.post("/notification/2fa/verify", SettingsController.verify2FA);

export interface RunSettingsResponseData {
  runSettings: {
    id: string;
    automationEnabled: boolean;
    automationMode: "full-run" | "buy-only" | "cross-account";
    giftAmount: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

router.get("/run", SettingsController.getRunSettings);

export interface UpdateRunSettingsRequestBody {
  automationEnabled?: boolean;
  automationMode?: "full-run" | "buy-only" | "cross-account";
  giftAmount?: number;
}

router.put("/run", SettingsController.updateRunSettings);

export interface WoltSettingsResponseData {
  woltSettings: {
    id: string;
    woltRefreshToken: string | null;
    woltAccessToken: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

router.get("/wolt", SettingsController.getWoltSettings);

export interface UpdateWoltSettingsRequestBody {
  woltRefreshToken?: string;
  woltAccessToken?: string;
}

router.put("/wolt", SettingsController.updateWoltSettings);

export { router as settingsRouter };
