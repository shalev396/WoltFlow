import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class Inbox extends Model {
  declare id: number;
  declare userId: number; // Foreign key to Users table
  declare emailAddress: string; // The SES-created email address
  declare sesIdentityArn: string | null; // AWS SES identity ARN
  declare sesVerificationStatus:
    | "pending"
    | "success"
    | "failed"
    | "temporary_failure"; // SES verification status
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Inbox.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // One inbox per user for now
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      comment: "Reference to the user who owns this inbox",
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      comment: "The SES-created email address for receiving emails",
    },
    sesIdentityArn: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "AWS SES identity ARN for this email address",
    },
    sesVerificationStatus: {
      type: DataTypes.ENUM("pending", "success", "failed", "temporary_failure"),
      allowNull: false,
      defaultValue: "pending",
      comment: "SES verification status of the email address",
    },
  },
  {
    sequelize,
    tableName: "Inbox",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId"],
      },
      {
        unique: true,
        fields: ["emailAddress"],
      },
      {
        fields: ["sesVerificationStatus"],
      },
    ],
  }
);

// Relationships are defined in models/index.ts to avoid circular dependencies
