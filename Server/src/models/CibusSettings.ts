import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class CibusSettings extends Model {
  declare id: string;
  declare cibusUsername: string | null; // Cibus username
  declare cibusPassword: string | null; // Cibus password (encrypted)
  declare cibusCompany: string | null; // Cibus company name
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CibusSettings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cibusUsername: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Cibus payment system username",
    },
    cibusPassword: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Cibus payment system password (encrypted)",
    },
    cibusCompany: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Cibus company identifier",
    },
  },
  {
    sequelize,
    tableName: "CibusSettings",
    timestamps: true,
  }
);
