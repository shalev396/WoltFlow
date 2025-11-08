import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import { decrypt, encrypt } from "../utils/encryption.js";

export default class WoltSettings extends Model {
  declare id: string;
  declare woltRefreshToken: string | null; // Wolt refresh token (wrtoken)
  declare woltAccessToken: string | null; // Wolt access token (wtoken)
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

WoltSettings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    woltRefreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Wolt refresh token for maintaining authentication",
      get() {
        const rawValue = this.getDataValue("woltRefreshToken");
        return rawValue ? decrypt(rawValue) : null;
      },
      set(value: string | null) {
        this.setDataValue("woltRefreshToken", value ? encrypt(value) : null);
      },
    },
    woltAccessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Wolt access token (JSON format with expiration)",
      get() {
        const rawValue = this.getDataValue("woltAccessToken");
        return rawValue ? decrypt(rawValue) : null;
      },
      set(value: string | null) {
        this.setDataValue("woltAccessToken", value ? encrypt(value) : null);
      },
    },
  },
  {
    sequelize,
    tableName: "WoltSettings",
    timestamps: true,
  }
);
