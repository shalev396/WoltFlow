import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class Screenshot extends Model {
  declare id: string; // UUID for unique identification
  declare runId: string; // Foreign key to Runs table
  declare screenshotType: "error" | "success" | "step" | "debug" | "final"; // Type of screenshot
  declare stage: string | null; // Stage when screenshot was taken
  declare siteUrl: string | null; // URL of the site where screenshot was taken
  declare screenshotUrl: string; // S3 URL for the screenshot image
  declare isError: boolean; // Whether this screenshot shows an error state
  declare dataExpiresAt: Date; // Data retention expiry (90 days)
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
      type: DataTypes.UUID,
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
    },
    stage: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Automation stage when screenshot was taken",
    },
    siteUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "URL of the site where screenshot was taken",
    },
    screenshotUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "S3 URL for the screenshot image",
    },
    isError: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Whether this screenshot shows an error state",
    },
    dataExpiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment:
        "When this record should be deleted (90 days per privacy policy)",
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
      {
        fields: ["dataExpiresAt"],
      },
    ],
    hooks: {
      beforeCreate: (instance: Screenshot) => {
        // Set data expiry to 90 days from creation (per privacy policy)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 90);
        expiryDate.setHours(23, 59, 59, 999);
        instance.dataExpiresAt = expiryDate;
      },
    },
  }
);

// Relationships are defined in models/index.ts to avoid circular dependencies
