// models/User.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export default class User extends Model {
  public userId!: string; // Google sub (unique ID)
  public refreshToken!: string; // Google refresh token
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
