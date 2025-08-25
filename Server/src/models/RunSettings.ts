import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class RunSettings extends Model {
  declare id: string;
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
        fields: ["automationMode"],
      },
    ],
  }
);
