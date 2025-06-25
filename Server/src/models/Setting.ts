import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

export default class Setting extends Model {
  declare settingsId: number;
  declare userId: string;
  declare isNotification: boolean;
  declare cookies: string | null; // deprecated field (keep for now)
  declare wrtoken: string | null; // new field
  declare wtoken: string | null; // new field
  declare cibusName: string | null;
  declare cibusPassword: string | null;
  declare cibusCompany: string | null;
  declare giftAmount: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Setting.init(
  {
    settingsId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "userId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    isNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    cookies: {
      type: DataTypes.TEXT, // <-- deprecated (keep for backward compatibility)
      allowNull: true,
    },
    wrtoken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    wtoken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cibusName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cibusPassword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cibusCompany: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    giftAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: "Settings",
    sequelize,
  }
);

Setting.belongsTo(User, { foreignKey: "userId" });
