import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import { decrypt, encrypt } from "../utils/encryption.js";

export default class Cibus2FA extends Model {
  declare id: string; // UUID
  declare userId: string; // Foreign key to Users table
  declare code: string; // 6-digit verification code from SMS
  declare message: string | null; // Original SMS message content
  declare receivedAt: Date; // When the SMS was received
  declare expiresAt: Date; // When the code expires (10 minutes after receivedAt)
  declare isUsed: boolean; // Whether the code has been used
  declare usedAt: Date | null; // When the code was used
  declare dataExpiresAt: Date; // Data retention expiry (daily purge)
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Cibus2FA.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      comment: "Reference to the user who owns this Cibus 2FA code",
    },
    code: {
      type: DataTypes.TEXT, // Changed to TEXT to accommodate encrypted data
      allowNull: false,
      comment: "6-digit Cibus verification code from SMS (encrypted)",
      get() {
        const rawValue = this.getDataValue("code");
        return rawValue ? decrypt(rawValue) : null;
      },
      set(value: string | null) {
        // Validate the input before encryption
        if (value && !/^\d{6}$/.test(value)) {
          throw new Error("Code must be exactly 6 digits");
        }
        this.setDataValue("code", value ? encrypt(value) : null);
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Original SMS message content",
      get() {
        const rawValue = this.getDataValue("message");
        return rawValue ? decrypt(rawValue) : null;
      },
      set(value: string | null) {
        this.setDataValue("message", value ? encrypt(value) : null);
      },
    },
    receivedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Timestamp when the SMS was received",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => {
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 10); // 10 minutes from now
        return expiryTime;
      },
      comment: "When the verification code expires (10 minutes after received)",
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Whether the code has been used for Cibus authentication",
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Timestamp when the code was used",
    },
    dataExpiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);
        expiryDate.setHours(23, 59, 59, 999);
        return expiryDate;
      },
      comment:
        "When this record should be deleted (daily purge per privacy policy)",
    },
  },
  {
    sequelize,
    tableName: "Cibus2FA",
    timestamps: true,
    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["code"],
      },
      {
        fields: ["expiresAt"],
      },
      {
        fields: ["isUsed"],
      },
      {
        fields: ["receivedAt"],
      },
      {
        fields: ["usedAt"],
      },
      {
        fields: ["dataExpiresAt"],
      },
      {
        unique: true,
        fields: ["userId", "code", "receivedAt"],
        name: "unique_user_code_time",
      },
    ],
  }
);

// Relationships are defined in models/index.ts to avoid circular dependencies
