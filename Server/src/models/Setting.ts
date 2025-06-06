// src/models/Settings.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

export default class Setting extends Model {
  public settingsId!: number;
  public userId!: string;
  public isNotification!: boolean;
  public woltAccessToken!: string | null;
  public woltRefreshToken!: string | null;
  public cibusName!: string | null;
  public cibusPassword!: string | null;
  public cibusCompany!: string | null;
  public giftAmount!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
        key: 'userId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    isNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    woltAccessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    woltRefreshToken: {
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

Setting.belongsTo(User, { foreignKey: 'userId' });
