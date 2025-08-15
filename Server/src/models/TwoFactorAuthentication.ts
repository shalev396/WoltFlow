import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

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
    ],
    hooks: {
      beforeCreate: (instance: TwoFactorAuthentication) => {
        // Automatically set expiration to 10 minutes after receivedAt
        const createdAt = instance.createdAt || new Date();
        instance.expiresAt = new Date(createdAt.getTime() + 10 * 60 * 1000); // 10 minutes
      },
    },
  }
);

// Relationships are defined in models/index.ts to avoid circular dependencies
