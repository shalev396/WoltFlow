import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class Screenshot extends Model {
  declare id: string; // UUID for unique identification
  declare runId: number; // Foreign key to Runs table
  declare screenshotType: "error" | "success" | "step" | "debug" | "final"; // Type of screenshot
  declare stage: string | null; // Stage when screenshot was taken
  declare siteUrl: string; // Site URL for the screenshot
  declare isError: boolean; // Whether this screenshot shows an error state
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Screenshot.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    runId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Runs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      comment: "Reference to the run this screenshot belongs to",
    },
    screenshotType: {
      type: DataTypes.ENUM("error", "success", "step", "debug", "final"),
      allowNull: false,
      defaultValue: "step",
      comment: "Type/purpose of the screenshot",
    },
    stage: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Automation stage when screenshot was taken",
    },
    siteUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Site URL for the screenshot",
    },
    isError: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Whether this screenshot shows an error state",
    },
  },
  {
    sequelize,
    tableName: "Screenshots",
    timestamps: true,
    indexes: [
      {
        fields: ["runId"],
      },
      {
        fields: ["screenshotType"],
      },
      {
        fields: ["stage"],
      },
      {
        fields: ["isError"],
      },
    ],
  }
);

// Relationships are defined in models/index.ts to avoid circular dependencies
