import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class NotificationSettings extends Model {
  declare id: number;
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
      comment: "Preferred notification delivery method",
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^\+[1-9]\d{1,14}$/, // E.164 format
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
        isEmail: true,
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
