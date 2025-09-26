import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import { decrypt, encrypt } from "../utils/encryption.js";

export default class TwoFactorAuthentication extends Model {
  declare id: string; // UUID
  declare notificationSettingsId: string; // Foreign key to NotificationSettings
  declare method: "sms" | "email"; // Verification method
  declare contact: string; // E.164 phone number or email address
  declare code: string; // 6-digit verification code
  declare purpose:
    | "phone_verification"
    | "email_verification"
    | "login"
    | "sensitive_action"; // Purpose of the 2FA
  declare expiresAt: Date; // When the code expires
  declare verified: boolean; // Whether the code has been used/verified
  declare dataExpiresAt: Date; // Data retention expiry (daily purge)
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TwoFactorAuthentication.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    notificationSettingsId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "NotificationSettings",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      comment: "Reference to notification settings",
    },
    method: {
      type: DataTypes.ENUM("sms", "email"),
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Phone number (E.164) or email address for code delivery",
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: {
        is: /^\d{6}$/,
      },
      comment: "6-digit verification code",
      get() {
        const rawValue = this.getDataValue("code");
        return rawValue ? decrypt(rawValue) : null;
      },
      set(value: string | null) {
        this.setDataValue("code", value ? encrypt(value) : null);
      },
    },
    purpose: {
      type: DataTypes.ENUM(
        "phone_verification",
        "email_verification",
        "login",
        "sensitive_action"
      ),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "When the verification code expires",
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Whether the code has been successfully verified",
    },
    dataExpiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);
        return tomorrow;
      },
      comment:
        "When this record should be deleted (daily purge per privacy policy)",
    },
  },
  {
    sequelize,
    tableName: "TwoFactorAuthentications",
    timestamps: true,
    indexes: [
      {
        fields: ["notificationSettingsId"],
      },
      {
        fields: ["method"],
      },
      {
        fields: ["contact"],
      },
      {
        fields: ["expiresAt"],
      },
      {
        fields: ["verified"],
      },
      {
        fields: ["purpose"],
      },
      {
        fields: ["createdAt"],
      },
      {
        fields: ["dataExpiresAt"],
      },
    ],
    hooks: {
      beforeCreate: (instance: TwoFactorAuthentication) => {
        // Automatically set code expiration to 10 minutes after creation
        const createdAt = instance.createdAt || new Date();
        instance.expiresAt = new Date(createdAt.getTime() + 10 * 60 * 1000); // 10 minutes
      },
    },
  }
);

// Relationships are defined in models/index.ts to avoid circular dependencies
