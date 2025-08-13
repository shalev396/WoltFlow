import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class Emails extends Model {
  declare id: string; // UUID for unique identification
  declare inboxId: number; // Foreign key to Inbox table (user's email address)
  declare messageId: string; // Email message ID from headers
  declare s3EmailUrl: string; // S3 URL to the email file
  declare s3PdfUrls: string[] | null; // Array of S3 URLs to PDF attachments
  declare attachmentCount: number; // Number of PDF attachments
  declare processingStatus:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "skipped"; // Processing status
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
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Inbox",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      comment: "Reference to the inbox that received this email",
    },
    messageId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Email message ID from headers for deduplication",
    },

    s3EmailUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "S3 URL to the email file",
    },
    s3PdfUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: "Array of S3 URLs to PDF attachments",
    },

    attachmentCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Number of PDF attachments",
    },
    processingStatus: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "completed",
        "failed",
        "skipped"
      ),
      allowNull: false,
      defaultValue: "pending",
      comment: "Status of email processing",
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
        fields: ["messageId"],
      },
      {
        unique: true,
        fields: ["inboxId", "messageId"],
        name: "unique_email_per_inbox",
      },
      {
        fields: ["processingStatus"],
      },
    ],
  }
);

// Relationships are defined in models/index.ts to avoid circular dependencies
