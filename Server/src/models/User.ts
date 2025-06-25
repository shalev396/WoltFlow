// models/User.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export default class User extends Model {
  declare userId: string; // Google sub (unique ID)
  declare refreshToken: string; // Google refresh token
  // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Users",
    sequelize,
  }
);
