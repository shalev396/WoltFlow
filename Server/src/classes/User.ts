import {
  type Model,
  Op,
  type InferAttributes,
  type WhereOptions,
} from "sequelize";
import UserModel from "../models/User.js";
import {
  Settings,
  NotificationSettings,
  RunSettings,
  WoltSettings,
  TwoFactorAuthentication,
  Run as RunModel,
  Screenshot,
} from "../models/index.js";
// Local Sequelize composite types (encapsulated from external consumers)
type SettingsWithNotificationSettings = Settings & {
  notificationSettings: NotificationSettings;
};
type SettingsWithRunSettings = Settings & {
  runSettings: RunSettings;
};
type SettingsWithWoltSettings = Settings & {
  woltSettings: WoltSettings;
};
import type {
  NotificationSettingsResponseData,
  UpdateNotificationSettingsRequestBody,
  Start2FAResponseData,
  Verify2FAResponseData,
  RunSettingsResponseData,
  UpdateRunSettingsRequestBody,
  WoltSettingsResponseData,
  UpdateWoltSettingsRequestBody,
} from "../routes/user/settings.js";
import { sendSmsBySenderID, formatPhoneNumber } from "../utils/smsUtil.js";
import { sendEmail, normalizeEmail } from "../utils/emailUtil.js";
import {
  createUserExportZip,
  generateExportFilename,
} from "../utils/exportUtil.js";
import { uploadZipToS3AndGetDownloadUrl } from "../utils/s3Util.js";
import {
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import type { ExportUserDataResponseData } from "../routes/user/account.js";

type UserAttributes = Omit<UserModel, keyof Model>;

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

export class User {
  private _id: UserAttributes["id"];
  private _cognitoSub: UserAttributes["cognitoSub"];
  private _name: UserAttributes["name"];
  private _email: UserAttributes["email"];
  private _lastLoginAt: UserAttributes["lastLoginAt"];
  private _createdAt: UserAttributes["createdAt"];
  private _updatedAt: UserAttributes["updatedAt"];

  constructor(data: UserAttributes) {
    this._id = data.id;
    this._cognitoSub = data.cognitoSub;
    this._name = data.name;
    this._email = data.email;
    this._lastLoginAt = data.lastLoginAt;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  // ==================== Getters ====================

  get id(): string {
    return this._id;
  }

  get cognitoSub(): string {
    return this._cognitoSub;
  }

  get name(): string | null {
    return this._name;
  }

  get email(): string | null {
    return this._email;
  }

  get lastLoginAt(): Date | null {
    return this._lastLoginAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ==================== Instance Methods ====================

  toJSON(): UserAttributes {
    return {
      id: this._id,
      cognitoSub: this._cognitoSub,
      name: this._name,
      email: this._email,
      lastLoginAt: this._lastLoginAt,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  // ==================== Static Methods - Query ====================

  static async findById(id: string): Promise<User | null> {
    const result = await UserModel.findByPk(id);
    if (!result) return null;
    return new User(result);
  }

  static async findByCognitoSub(cognitoSub: string): Promise<User | null> {
    const result = await UserModel.findOne({ where: { cognitoSub } });
    if (!result) return null;
    return new User(result);
  }

  /**
   * Resolves either an internal `User.id` or a `cognitoSub` to the internal
   * `User.id`. Returns `null` if no user matches either column.
   *
   * Both identifiers are UUID-shaped, so we can't distinguish them by format —
   * we try `id` first (cheap PK lookup) and fall back to `cognitoSub`.
   */
  static async resolveToInternalId(idOrSub: string): Promise<string | null> {
    const byId = await UserModel.findOne({
      where: { id: idOrSub },
      attributes: ["id"],
    });
    if (byId) return byId.id;

    const bySub = await UserModel.findOne({
      where: { cognitoSub: idOrSub },
      attributes: ["id"],
    });
    return bySub?.id ?? null;
  }

  // ==================== Static Methods - Auth ====================

  static async upsertFromLogin(
    cognitoSub: string,
    email: string | null,
    name: string | null,
  ): Promise<User> {
    const [record] = await UserModel.upsert({
      cognitoSub,
      email: email ?? null,
      name: name ?? null,
      lastLoginAt: new Date(),
    });
    return new User(record);
  }

  static async ensureSettings(userIdOrSub: string): Promise<void> {
    let userId: string;

    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        userIdOrSub,
      );

    if (isUUID) {
      userId = userIdOrSub;
    } else {
      const user = await UserModel.findOne({
        where: { cognitoSub: userIdOrSub },
      });
      if (!user) {
        console.error(`User not found for cognitoSub: ${userIdOrSub}`);
        return;
      }
      userId = user.id;
    }

    const existing = await Settings.findOne({ where: { userId } });
    if (existing) {
      console.log(`Settings already exist for user: ${userId}`);
      return;
    }

    const settings = await Settings.create({
      userId,
      notificationSettingsId: null,
      woltSettingsId: null,
      runSettingsId: null,
    });
    console.log(`Created Settings: ${settings.id}`);
  }

  // ==================== Static Methods - Notification Settings ====================

  static async getNotificationSettings(
    userId: string,
  ): Promise<NotificationSettingsResponseData> {
    const settings = (await Settings.findOne({
      where: { userId },
      include: [
        {
          model: NotificationSettings,
          as: "notificationSettings",
          required: false,
        },
      ],
    })) as SettingsWithNotificationSettings | null;

    return {
      notificationSettings: settings?.notificationSettings
        ? {
            id: settings.notificationSettings.id,
            isEnabled: settings.notificationSettings.isEnabled,
            notificationMethod:
              settings.notificationSettings.notificationMethod,
            notificationOnSuccess:
              settings.notificationSettings.notificationOnSuccess,
            notificationOnError:
              settings.notificationSettings.notificationOnError,
            phoneNumber: settings.notificationSettings.phoneNumber,
            phoneVerified: settings.notificationSettings.phoneVerified,
            email: settings.notificationSettings.email,
            emailVerified: settings.notificationSettings.emailVerified,
            createdAt: settings.notificationSettings.createdAt,
            updatedAt: settings.notificationSettings.updatedAt,
          }
        : null,
    };
  }

  static async updateNotificationSettings(
    userId: string,
    requestData: UpdateNotificationSettingsRequestBody,
  ): Promise<NotificationSettingsResponseData> {
    const [settings] = (await Settings.findOrCreate({
      where: { userId },
      defaults: { userId },
      include: [
        {
          model: NotificationSettings,
          as: "notificationSettings",
          required: false,
        },
      ],
    })) as [SettingsWithNotificationSettings, boolean];

    let notificationSettings: NotificationSettings;

    if (settings.notificationSettings) {
      notificationSettings = settings.notificationSettings;
    } else {
      notificationSettings = await NotificationSettings.create({
        isEnabled: false,
        notificationOnSuccess: false,
        notificationOnError: false,
        phoneVerified: false,
        emailVerified: false,
      });

      await settings.update({
        notificationSettingsId: notificationSettings.id,
      });
    }

    const updates: Partial<InferAttributes<NotificationSettings>> = {};

    if (requestData.isEnabled !== undefined) {
      updates.isEnabled = requestData.isEnabled;
    }
    if (requestData.notificationMethod !== undefined) {
      updates.notificationMethod = requestData.notificationMethod;
    }
    if (requestData.notificationOnSuccess !== undefined) {
      updates.notificationOnSuccess = requestData.notificationOnSuccess;
    }
    if (requestData.notificationOnError !== undefined) {
      updates.notificationOnError = requestData.notificationOnError;
    }
    if (requestData.phoneNumber !== undefined) {
      updates.phoneNumber = requestData.phoneNumber;
    }
    if (requestData.phoneVerified !== undefined) {
      updates.phoneVerified = requestData.phoneVerified;
    }
    if (requestData.email !== undefined) {
      updates.email = requestData.email;
    }
    if (requestData.emailVerified !== undefined) {
      updates.emailVerified = requestData.emailVerified;
    }

    await notificationSettings.update(updates);
    await notificationSettings.reload();

    return {
      notificationSettings: {
        id: notificationSettings.id,
        isEnabled: notificationSettings.isEnabled,
        notificationMethod: notificationSettings.notificationMethod,
        notificationOnSuccess: notificationSettings.notificationOnSuccess,
        notificationOnError: notificationSettings.notificationOnError,
        phoneNumber: notificationSettings.phoneNumber,
        phoneVerified: notificationSettings.phoneVerified,
        email: notificationSettings.email,
        emailVerified: notificationSettings.emailVerified,
        createdAt: notificationSettings.createdAt,
        updatedAt: notificationSettings.updatedAt,
      },
    };
  }

  // ==================== Static Methods - 2FA ====================

  static async start2FA(
    userId: string,
    method: "sms" | "email",
    contact: string,
  ): Promise<Start2FAResponseData> {
    if (method === "sms") {
      const enabledSMS = process.env.ENABLED_SMS;
      if (!enabledSMS) {
        throw new Error("SMS functionality is currently disabled");
      }
    }

    let formattedContact: string;
    if (method === "sms") {
      const formatted = formatPhoneNumber(contact);
      if (!formatted) {
        throw new Error("Invalid phone number format");
      }
      formattedContact = formatted;
    } else {
      const normalized = normalizeEmail(contact);
      if (!normalized) {
        throw new Error("Invalid email address format");
      }
      formattedContact = normalized;
    }

    const [settings] = (await Settings.findOrCreate({
      where: { userId },
      defaults: { userId },
      include: [
        {
          model: NotificationSettings,
          as: "notificationSettings",
        },
      ],
    })) as [SettingsWithNotificationSettings, boolean];

    let notificationSettingsId: string;

    if (settings.notificationSettings) {
      notificationSettingsId = settings.notificationSettings.id;
    } else {
      const newNotificationSettings = await NotificationSettings.create({
        isEnabled: false,
        notificationOnSuccess: false,
        notificationOnError: false,
        phoneVerified: false,
        emailVerified: false,
      });

      await settings.update({
        notificationSettingsId: newNotificationSettings.id,
      });

      notificationSettingsId = newNotificationSettings.id;
    }

    const recentCode = await TwoFactorAuthentication.findOne({
      where: {
        notificationSettingsId,
        method,
        createdAt: {
          [Op.gte]: new Date(Date.now() - 30000),
        },
      },
      order: [["createdAt", "DESC"]],
    });

    if (recentCode) {
      throw new Error("Please wait 30 seconds before requesting another code");
    }

    await TwoFactorAuthentication.destroy({
      where: {
        notificationSettingsId,
        method,
        verified: false,
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const verificationRecord = await TwoFactorAuthentication.create({
      notificationSettingsId,
      method,
      contact: formattedContact,
      code,
      purpose: method === "sms" ? "phone_verification" : "email_verification",
      expiresAt,
      verified: false,
    });

    if (method === "sms") {
      const result = await sendSmsBySenderID({
        phoneNumber: formattedContact,
        message: `Your WoltFlow verification code is: ${code}. This code expires in 5 minutes. Never share this code with anyone.`,
        senderID: "WoltFlow",
        smsType: "Transactional",
      });

      if (!result.success) {
        console.error("Failed to send SMS:", result.error);
        throw new Error("Failed to send SMS verification code");
      }
    } else {
      const templatePath = path.join(
        process.cwd(),
        "templates",
        "2FA",
        "index.html",
      );
      let emailTemplate = fs.readFileSync(templatePath, "utf8");

      emailTemplate = emailTemplate
        .replace(/{{VERIFICATION_CODE}}/g, code)
        .replace(/{{METHOD_DISPLAY}}/g, "email address");

      const result = await sendEmail({
        to: formattedContact,
        subject: "WoltFlow - Verification Code",
        htmlBody: emailTemplate,
        textBody: `Your WoltFlow verification code is: ${code}. This code expires in 5 minutes. Never share this code with anyone.`,
      });

      if (!result.success) {
        console.error("Failed to send email:", result.error);
        throw new Error("Failed to send email verification code");
      }
    }

    console.log(
      `Verification code sent via ${method} to ${formattedContact} for user ${userId}`,
    );

    return { sessionId: verificationRecord.id };
  }

  static async verify2FA(
    userId: string,
    method: "sms" | "email",
    code: string,
    sessionId?: string,
  ): Promise<Verify2FAResponseData> {
    const settings = (await Settings.findOne({
      where: { userId },
      include: [
        {
          model: NotificationSettings,
          as: "notificationSettings",
        },
      ],
    })) as SettingsWithNotificationSettings | null;

    const notificationSettings = settings
      ? settings.notificationSettings
      : null;

    if (!settings || !notificationSettings) {
      throw new Error("User notification settings not found");
    }

    type TFAAttrs = InferAttributes<TwoFactorAuthentication>;

    const whereClause: WhereOptions<TFAAttrs> = {
      notificationSettingsId: notificationSettings.id,
      method,
      verified: false,
      expiresAt: { [Op.gte]: new Date() },
      ...(sessionId ? { id: sessionId } : {}),
    } satisfies WhereOptions<TFAAttrs>;

    const verificationRecords = await TwoFactorAuthentication.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    let verificationRecord: TwoFactorAuthentication | null = null;
    for (const record of verificationRecords) {
      if (record.code === code) {
        verificationRecord = record;
        break;
      }
    }

    if (!verificationRecord) {
      console.log(
        `Verification failed for user ${userId}: Found ${verificationRecords.length} potential records, but none matched the provided code`,
      );
      throw new Error("Invalid or expired verification code");
    }

    verificationRecord.verified = true;
    await verificationRecord.save();

    console.log(
      `Verification code verified for user ${userId}, method: ${method}, contact: ${verificationRecord.contact}`,
    );

    return { contact: verificationRecord.contact };
  }

  // ==================== Static Methods - Run Settings ====================

  static async getRunSettings(
    userId: string,
  ): Promise<RunSettingsResponseData> {
    const settings = (await Settings.findOne({
      where: { userId },
      include: [
        {
          model: RunSettings,
          as: "runSettings",
          required: false,
        },
      ],
    })) as SettingsWithRunSettings | null;

    return {
      runSettings: settings?.runSettings
        ? {
            id: settings.runSettings.id,
            automationEnabled: settings.runSettings.automationEnabled,
            giftAmount:
              settings.runSettings.giftAmount !== null
                ? String(settings.runSettings.giftAmount)
                : null,
            createdAt: settings.runSettings.createdAt,
            updatedAt: settings.runSettings.updatedAt,
          }
        : null,
    };
  }

  static async updateRunSettings(
    userId: string,
    requestData: UpdateRunSettingsRequestBody,
  ): Promise<RunSettingsResponseData> {
    const [settings] = (await Settings.findOrCreate({
      where: { userId },
      defaults: { userId },
      include: [
        {
          model: RunSettings,
          as: "runSettings",
          required: false,
        },
      ],
    })) as [SettingsWithRunSettings, boolean];

    let runSettings: RunSettings;

    if (settings.runSettings) {
      runSettings = settings.runSettings;
    } else {
      runSettings = await RunSettings.create({
        automationEnabled: false,
        giftAmount: null,
      });

      await settings.update({
        runSettingsId: runSettings.id,
      });
    }

    const updates: Partial<InferAttributes<RunSettings>> = {};

    if (requestData.automationEnabled !== undefined) {
      updates.automationEnabled = requestData.automationEnabled;
    }
    if (requestData.giftAmount !== undefined) {
      updates.giftAmount = requestData.giftAmount;
    }

    await runSettings.update(updates);
    await runSettings.reload();

    return {
      runSettings: {
        id: runSettings.id,
        automationEnabled: runSettings.automationEnabled,
        giftAmount:
          runSettings.giftAmount !== null
            ? String(runSettings.giftAmount)
            : null,
        createdAt: runSettings.createdAt,
        updatedAt: runSettings.updatedAt,
      },
    };
  }

  // ==================== Static Methods - Wolt Settings ====================

  static async getWoltSettings(
    userId: string,
  ): Promise<WoltSettingsResponseData> {
    const settings = (await Settings.findOne({
      where: { userId },
      include: [
        {
          model: WoltSettings,
          as: "woltSettings",
          required: false,
        },
      ],
    })) as SettingsWithWoltSettings | null;

    return {
      woltSettings: settings?.woltSettings
        ? {
            id: settings.woltSettings.id,
            woltRefreshToken: settings.woltSettings.woltRefreshToken,
            woltAccessToken: settings.woltSettings.woltAccessToken,
            createdAt: settings.woltSettings.createdAt,
            updatedAt: settings.woltSettings.updatedAt,
          }
        : null,
    };
  }

  static async updateWoltSettings(
    userId: string,
    requestData: UpdateWoltSettingsRequestBody,
  ): Promise<WoltSettingsResponseData> {
    const [settings] = (await Settings.findOrCreate({
      where: { userId },
      defaults: { userId },
      include: [
        {
          model: WoltSettings,
          as: "woltSettings",
          required: false,
        },
      ],
    })) as [SettingsWithWoltSettings, boolean];

    let woltSettings: WoltSettings;

    if (settings.woltSettings) {
      woltSettings = settings.woltSettings;
    } else {
      woltSettings = await WoltSettings.create({
        woltRefreshToken: null,
        woltAccessToken: null,
      });

      await settings.update({
        woltSettingsId: woltSettings.id,
      });
    }

    const updates: Partial<InferAttributes<WoltSettings>> = {};

    if (requestData.woltRefreshToken !== undefined) {
      updates.woltRefreshToken = requestData.woltRefreshToken;
    }
    if (requestData.woltAccessToken !== undefined) {
      updates.woltAccessToken = requestData.woltAccessToken;
    }

    await woltSettings.update(updates);
    await woltSettings.reload();

    return {
      woltSettings: {
        id: woltSettings.id,
        woltRefreshToken: woltSettings.woltRefreshToken,
        woltAccessToken: woltSettings.woltAccessToken,
        createdAt: woltSettings.createdAt,
        updatedAt: woltSettings.updatedAt,
      },
    };
  }

  // ==================== Static Methods - Export & Delete ====================

  static async exportData(
    userId: string,
    cognitoSub: string,
  ): Promise<ExportUserDataResponseData> {
    const user = await UserModel.findOne({ where: { cognitoSub } });
    if (!user) {
      throw new Error("User not found");
    }

    const settings = await Settings.findOne({ where: { userId } });

    let notificationSettingsData = null;
    let woltSettingsData = null;
    let runSettingsData = null;
    let twoFactorAuthentications: TwoFactorAuthentication[] = [];

    if (settings) {
      if (settings.notificationSettingsId) {
        notificationSettingsData = await NotificationSettings.findByPk(
          settings.notificationSettingsId,
        );

        if (notificationSettingsData) {
          twoFactorAuthentications = await TwoFactorAuthentication.findAll({
            where: { notificationSettingsId: notificationSettingsData.id },
          });
        }
      }

      if (settings.woltSettingsId) {
        woltSettingsData = await WoltSettings.findByPk(settings.woltSettingsId);
      }

      if (settings.runSettingsId) {
        runSettingsData = await RunSettings.findByPk(settings.runSettingsId);
      }
    }

    const runs = await RunModel.findAll({ where: { userId } });

    const runIds = runs.map((run) => run.id);
    const screenshots =
      runIds.length > 0
        ? await Screenshot.findAll({ where: { runId: runIds } })
        : [];

    const exportData: CompleteUserExport = {
      user: user.toJSON(),
      settings: settings ? settings.toJSON() : null,
      notificationSettings: notificationSettingsData
        ? notificationSettingsData.toJSON()
        : null,
      woltSettings: woltSettingsData ? woltSettingsData.toJSON() : null,
      runSettings: runSettingsData ? runSettingsData.toJSON() : null,
      twoFactorAuthentications: twoFactorAuthentications.map((tfa) =>
        tfa.toJSON(),
      ),
      runs: runs.map((run) => run.toJSON()),
      screenshots: screenshots.map((screenshot) => screenshot.toJSON()),
    };

    console.log("Creating ZIP export for user:", userId);
    const zipBuffer = await createUserExportZip(exportData);
    const filename = generateExportFilename(user.email);

    console.log(
      `ZIP export created: ${filename}, size: ${zipBuffer.length} bytes`,
    );

    console.log("Uploading ZIP to S3 and generating download URL...");
    const { downloadUrl } = await uploadZipToS3AndGetDownloadUrl(
      zipBuffer,
      filename,
    );

    console.log("ZIP uploaded successfully, returning download URL");

    return {
      downloadUrl,
      filename,
      size: zipBuffer.length,
      expiresIn: "24 hours",
    };
  }

  static async deleteAccount(
    userId: string,
    cognitoSub: string,
  ): Promise<void> {
    const user = await UserModel.findOne({ where: { cognitoSub } });
    if (!user) {
      throw new Error("User not found");
    }

    console.log(`Starting account deletion for user ${userId}`);

    try {
      const userPoolId = process.env["COGNITO_USER_POOL_ID"];
      if (!userPoolId) {
        console.error("COGNITO_USER_POOL_ID not set");
      } else {
        await cognitoClient.send(
          new AdminDeleteUserCommand({
            UserPoolId: userPoolId,
            Username: cognitoSub,
          }),
        );
        console.log(`Deleted user ${cognitoSub} from Cognito`);
      }
    } catch (cognitoError) {
      console.error("Error deleting user from Cognito:", cognitoError);
    }

    const runs = await RunModel.findAll({ where: { userId } });
    const runIds = runs.map((run) => run.id);
    const screenshots =
      runIds.length > 0
        ? await Screenshot.findAll({ where: { runId: runIds } })
        : [];

    for (const screenshot of screenshots) {
      try {
        const screenshotUrl = screenshot.screenshotUrl;
        if (screenshotUrl) {
          const s3UrlMatch = screenshotUrl.match(/s3:\/\/([^/]+)\/(.+)/);
          if (s3UrlMatch) {
            const bucketName = s3UrlMatch[1];
            const objectKey = s3UrlMatch[2];

            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: bucketName,
                Key: objectKey,
              }),
            );
            console.log(`Deleted screenshot from S3: ${objectKey}`);
          }
        }
      } catch (s3Error) {
        console.error(
          `Error deleting screenshot ${screenshot.id} from S3:`,
          s3Error,
        );
      }
    }

    await UserModel.destroy({ where: { id: userId } });
    console.log(`User ${userId} deleted successfully`);
  }

  // ==================== Static Methods - Automation ====================

  static async findAllForAutomation(
    targetUserId?: string,
  ): Promise<AutomationUserData[]> {
    const whereClause = targetUserId ? { id: targetUserId } : {};

    const users = await UserModel.findAll({
      where: whereClause,
      include: [
        {
          model: Settings,
          as: "settings",
          required: false,
          include: [
            {
              model: RunSettings,
              as: "runSettings",
              required: false,
            },
            {
              model: NotificationSettings,
              as: "notificationSettings",
              required: false,
            },
          ],
        },
      ],
    });

    type UserWithSettings = UserModel & {
      settings?: Settings & {
        runSettings?: RunSettings;
        notificationSettings?: NotificationSettings;
      };
    };

    return (users as UserWithSettings[])
      .filter((user) => {
        const runSettings = user.settings?.runSettings;
        return runSettings?.automationEnabled;
      })
      .map((user) => ({
        userId: user.id,
        giftAmount: user.settings?.runSettings?.giftAmount ?? null,
        isNotificationEnabled: user.settings?.notificationSettings?.isEnabled || false,
      }));
  }

  static async updateWoltTokens(
    userId: string,
    refreshToken: string,
    accessToken: string,
  ): Promise<void> {
    const settings = (await Settings.findOne({
      where: { userId },
      include: [
        {
          model: WoltSettings,
          as: "woltSettings",
        },
      ],
    })) as (Settings & { woltSettings?: WoltSettings }) | null;

    if (!settings?.woltSettings) {
      throw new Error("Wolt settings not found for user");
    }

    await settings.woltSettings.update({
      woltRefreshToken: refreshToken,
      woltAccessToken: accessToken,
    });
  }

  // ==================== Static Methods - Notification ====================

  static async getNotificationDetails(
    userId: string,
  ): Promise<UserNotificationDetails | null> {
    const setting = (await Settings.findOne({
      where: { userId },
      include: [
        {
          model: UserModel,
          attributes: ["name", "email"],
          as: "user",
        },
        {
          model: NotificationSettings,
          as: "notificationSettings",
        },
      ],
    })) as (Settings & { user?: UserModel; notificationSettings?: NotificationSettings }) | null;

    if (!setting) return null;

    if (!setting.notificationSettings) {
      return {
        user: {
          name: setting.user?.name || "",
          email: setting.user?.email || "",
        },
        notificationSettings: null,
      };
    }

    return {
      user: {
        name: setting.user?.name || "",
        email: setting.user?.email || "",
      },
      notificationSettings: {
        isEnabled: setting.notificationSettings.isEnabled,
        notificationOnError: setting.notificationSettings.notificationOnError,
        notificationOnSuccess: setting.notificationSettings.notificationOnSuccess,
        notificationMethod: setting.notificationSettings.notificationMethod ?? null,
        phoneNumber: setting.notificationSettings.phoneNumber ?? null,
        email: setting.notificationSettings.email ?? null,
      },
    };
  }

}

// ==================== Exported Interfaces ====================

export interface AutomationUserData {
  userId: string;
  giftAmount: number | null;
  isNotificationEnabled: boolean;
}

export interface UserNotificationDetails {
  user: {
    name: string;
    email: string;
  };
  notificationSettings: {
    isEnabled: boolean;
    notificationOnError: boolean;
    notificationOnSuccess: boolean;
    notificationMethod: string | null;
    phoneNumber: string | null;
    email: string | null;
  } | null;
}

export interface CompleteUserExport {
  user: UserModel;
  settings: Settings | null;
  notificationSettings: NotificationSettings | null;
  woltSettings: WoltSettings | null;
  runSettings: RunSettings | null;
  twoFactorAuthentications: TwoFactorAuthentication[];
  runs: RunModel[];
  screenshots: Screenshot[];
}
