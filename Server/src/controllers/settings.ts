import { type RequestHandler } from "express";
import { User } from "../classes/index.js";
import { type AuthenticatedRequest } from "../types/express.js";
import type {
  UpdateNotificationSettingsRequestBody,
  Start2FARequestBody,
  Verify2FARequestBody,
  UpdateRunSettingsRequestBody,
  UpdateWoltSettingsRequestBody,
} from "../routes/user/settings.js";

export class SettingsController {
  static getNotificationSettings: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;

      const data = await User.getNotificationSettings(userId);
      res.success(data);
    } catch (error) {
      console.error("Error in getNotificationSettings handler:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to retrieve notification settings";
      res.error(errorMessage, 500);
    }
  };

  static updateNotificationSettings: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const requestData = req.body as UpdateNotificationSettingsRequestBody;

      const data = await User.updateNotificationSettings(userId, requestData);
      res.success(data);
    } catch (error) {
      console.error("Error in updateNotificationSettings:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update notification settings";
      res.error(errorMessage, 500);
    }
  };

  static start2FA: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const { method, contact } = req.body as Start2FARequestBody;

      if (!method || !contact) {
        res.error("Method and contact are required", 400);
        return;
      }

      if (!["sms", "email"].includes(method)) {
        res.error("Method must be 'sms' or 'email'", 400);
        return;
      }

      const data = await User.start2FA(userId, method, contact);
      res.success(data);
    } catch (error) {
      console.error("Error in start2FA handler:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Internal server error";
      const statusCode = errorMessage.includes("wait 30 seconds") ? 429
        : errorMessage.includes("not found") ? 404
        : errorMessage.includes("disabled") || errorMessage.includes("Invalid") ? 400
        : 500;
      res.error(errorMessage, statusCode);
    }
  };

  static verify2FA: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const { method, code, sessionId } = req.body as Verify2FARequestBody;

      if (!method || !code) {
        res.error("Method and code are required", 400);
        return;
      }

      if (!["sms", "email"].includes(method)) {
        res.error("Method must be 'sms' or 'email'", 400);
        return;
      }

      if (!/^\d{6}$/.test(code)) {
        res.error("Code must be 6 digits", 400);
        return;
      }

      const data = await User.verify2FA(userId, method, code, sessionId);
      res.success(data);
    } catch (error) {
      console.error("Error in verify2FA handler:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Internal server error";
      const statusCode = errorMessage.includes("not found") ? 404
        : errorMessage.includes("Invalid or expired") ? 400
        : 500;
      res.error(errorMessage, statusCode);
    }
  };

  static getRunSettings: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;

      const data = await User.getRunSettings(userId);
      res.success(data);
    } catch (error) {
      console.error("Error in getRunSettings handler:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retrieve run settings";
      res.error(errorMessage, 500);
    }
  };

  static updateRunSettings: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const requestData = req.body as UpdateRunSettingsRequestBody;

      const data = await User.updateRunSettings(userId, requestData);
      res.success(data);
    } catch (error) {
      console.error("Error in updateRunSettings:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update run settings";
      res.error(errorMessage, 500);
    }
  };

  static getWoltSettings: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;

      const data = await User.getWoltSettings(userId);
      res.success(data);
    } catch (error) {
      console.error("Error in getWoltSettings handler:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retrieve Wolt settings";
      res.error(errorMessage, 500);
    }
  };

  static updateWoltSettings: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const requestData = req.body as UpdateWoltSettingsRequestBody;

      const data = await User.updateWoltSettings(userId, requestData);
      res.success(data);
    } catch (error) {
      console.error("Error in updateWoltSettings:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update Wolt settings";
      res.error(errorMessage, 500);
    }
  };
}
