// src/models/Code.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

export default class Code extends Model {
  declare codeId: number;
  declare userId: string;
  declare code: string;
  declare isUsed: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Code.init(
  {
    codeId: {
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "Codes",
    sequelize,
  }
);
