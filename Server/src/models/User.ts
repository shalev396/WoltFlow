// models/User.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class User extends Model {
  declare userId: string; // Google sub (unique ID)
  declare refreshToken: string; // Google refresh token
  declare name?: string; // User's display name (optional for existing users)
  declare email?: string; // User's email address (optional for existing users)
  declare apiKey?: string; // API key for SMS forwarding and external access
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
    name: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null for existing users
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null for existing users
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: "Users",
    sequelize,
  }
);
