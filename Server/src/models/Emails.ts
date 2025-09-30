import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class Emails extends Model {
  declare id: string; // UUID for unique identification
  declare inboxId: string; // Foreign key to Inbox table (user's email address)
  declare s3EmailUrl: string; // S3 URL to the email file
  declare attachmentUrls: string[] | null; // Array of S3 URLs to attachments

  // Email content fields
  declare fromEmail: string; // Sender email address
  declare fromName: string | null; // Sender display name
  declare toEmail: string; // Recipient email address
  declare toName: string | null; // Recipient display name
  declare subject: string; // Email subject
  declare body: string | null; // Email body content
  declare emailDate: Date; // Original email date
  declare dataExpiresAt: Date; // Data retention expiry (90 days)

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Emails.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    inboxId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Inbox",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      comment: "Reference to the inbox that received this email",
    },
    s3EmailUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "S3 URL to the email file",
    },
    attachmentUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: "Array of S3 URLs to attachments (PDFs, images, docs, etc.)",
    },

    // Email content fields
    fromEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Sender email address",
    },
    fromName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Sender display name",
    },
    toEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Recipient email address",
    },
    toName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Recipient display name",
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Email subject line",
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Email body content",
    },
    emailDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Original email timestamp",
    },
    dataExpiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 90);
        expiryDate.setHours(23, 59, 59, 999);
        return expiryDate;
      },
      comment:
        "When this record should be deleted (90 days per privacy policy)",
    },
  },
  {
    sequelize,
    tableName: "Emails",
    timestamps: true,
    indexes: [
      {
        fields: ["inboxId"],
      },
      {
        fields: ["emailDate"],
      },
      {
        fields: ["fromEmail"],
      },
      {
        fields: ["toEmail"],
      },
      {
        fields: ["dataExpiresAt"],
      },
    ],
  }
);

// Relationships are defined in models/index.ts to avoid circular dependencies
