import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class Run extends Model {
  declare id: number;
  declare userId: number; // Foreign key to Users table (using internal ID now)
  declare status: "started" | "in_progress" | "completed" | "failed";
  declare stage:
    | "triggered"
    | "refreshing_tokens"
    | "buying_gift"
    | "getting_code_from_email"
    | "applying_gift"
    | "completed";

  declare automationMode: "full-run" | "buy-only" | "cross-account"; // Copied from user settings at creation
  declare errorMessage: string | null; // Error message if failed
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Run.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      comment: "Reference to the user who owns this run",
    },
    status: {
      type: DataTypes.ENUM("started", "in_progress", "completed", "failed"),
      allowNull: false,
      defaultValue: "started",
      comment: "Current status of the automation run",
    },
    stage: {
      type: DataTypes.ENUM(
        "triggered",
        "refreshing_tokens",
        "buying_gift",
        "getting_code_from_email",
        "applying_gift",
        "completed"
      ),
      allowNull: false,
      defaultValue: "triggered",
      comment: "Current stage of the automation process",
    },
    automationMode: {
      type: DataTypes.ENUM("full-run", "buy-only", "cross-account"),
      allowNull: false,
      defaultValue: "full-run",
      comment: "Type of automation to execute",
    },

    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Error message if the run failed",
    },
  },
  {
    sequelize,
    tableName: "Runs",
    timestamps: true,
    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["stage"],
      },
      {
        fields: ["automationMode"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  }
);

// Relationships are defined in models/index.ts to avoid circular dependencies
