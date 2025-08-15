import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class NotificationSettings extends Model {
  declare id: string;
  declare isEnabled: boolean; // Master switch for notifications
  declare notificationOnSuccess: boolean; // Enable notifications for successful runs
  declare notificationOnError: boolean; // Enable notifications for failed runs
  declare notificationMethod: "sms" | "email" | null; // Preferred notification method
  declare phoneNumber: string | null; // Phone number for SMS notifications
  declare phoneVerified: boolean; // Whether phone number is verified
  declare email: string | null; // Email for notifications (can be different from user's main email)
  declare emailVerified: boolean; // Whether notification email is verified
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

NotificationSettings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Master switch for all notifications",
    },
    notificationOnSuccess: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "Send notifications for successful automation runs",
    },
    notificationOnError: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "Send notifications for failed automation runs",
    },
    notificationMethod: {
      type: DataTypes.ENUM("sms", "email", "both"),
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidPhone(value: string | null) {
          // Only validate if value is not null/empty
          if (value && value.trim() !== "") {
            if (!/^\+[1-9]\d{1,14}$/.test(value)) {
              throw new Error(
                "Phone number must be in E.164 format (e.g., +1234567890)"
              );
            }
          }
        },
      },
      comment: "Phone number for SMS notifications (E.164 format)",
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Whether the phone number has been verified",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidEmail(value: string | null) {
          // Only validate if value is not null/empty
          if (value && value.trim() !== "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              throw new Error("Please provide a valid email address");
            }
          }
        },
      },
      comment: "Email address for notifications",
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Whether the notification email has been verified",
    },
  },
  {
    sequelize,
    tableName: "NotificationSettings",
    timestamps: true,
    indexes: [
      {
        fields: ["isEnabled"],
      },
      {
        fields: ["notificationMethod"],
      },
      {
        fields: ["phoneVerified"],
      },
      {
        fields: ["emailVerified"],
      },
    ],
  }
);
