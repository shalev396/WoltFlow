import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class RunSettings extends Model {
  declare id: string;
  declare settingsId: string; // Foreign key to Settings table (1:1)
  declare automationMode: "full-run" | "buy-only" | "cross-account";
  declare giftAmount: number | null; // Default gift card amount
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RunSettings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    settingsId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Settings",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      comment: "Reference to the main settings (1:1 relationship)",
    },
    automationMode: {
      type: DataTypes.ENUM("full-run", "buy-only", "cross-account"),
      allowNull: false,
      defaultValue: "full-run",
    },
    giftAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
      comment: "Default gift card amount for runs",
    },
  },
  {
    sequelize,
    tableName: "RunSettings",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["settingsId"],
      },
      {
        fields: ["automationMode"],
      },
    ],
  }
);
