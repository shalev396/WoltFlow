import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class WoltSettings extends Model {
  declare id: number;
  declare woltRefreshToken: string | null; // Wolt refresh token (wrtoken)
  declare woltAccessToken: string | null; // Wolt access token (wtoken)
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

WoltSettings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    woltRefreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Wolt refresh token for maintaining authentication",
    },
    woltAccessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Wolt access token (JSON format with expiration)",
    },
  },
  {
    sequelize,
    tableName: "WoltSettings",
    timestamps: true,
  }
);
