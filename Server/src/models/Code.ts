import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class Code extends Model {
  declare id: string;
  declare userId: string; // Foreign key to Users table
  declare runId: string | null; // Foreign key to Runs table (which run generated this code)
  declare emailId: string | null; // Foreign key to Emails table (which email contained this code)
  declare code: string; // The actual gift card code
  declare isUsed: boolean; // Whether the code has been used/redeemed
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Code.init(
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
      comment: "Reference to the user who owns this code",
    },
    runId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Runs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      comment: "Reference to the run that generated this code",
    },
    emailId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Emails",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      comment: "Reference to the email that contained this code",
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: "The actual gift card or promo code",
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Whether the code has been used/redeemed",
    },
  },
  {
    sequelize,
    tableName: "Codes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["code"],
      },
      {
        fields: ["userId"],
      },
      {
        fields: ["runId"],
      },
      {
        fields: ["emailId"],
      },
      {
        fields: ["isUsed"],
      },
    ],
  }
);

// Relationships are defined in models/index.ts to avoid circular dependencies
