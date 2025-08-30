import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class Inbox extends Model {
  declare id: string;
  declare userId: string; // Foreign key to Users table
  declare emailAddress: string; // The SES-created email address
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Inbox.init(
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
      comment: "Reference to the user who owns this inbox",
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      comment: "The SES-created email address for receiving emails",
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
