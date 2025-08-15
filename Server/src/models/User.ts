import { DataTypes, Model, Op } from "sequelize";
import sequelize from "../config/database.js";

export default class User extends Model {
  declare id: string; // UUID primary key
  declare googleId: string; // Google sub (unique external ID)
  declare googleRefreshToken: string; // Google refresh token
  declare name: string | null; // User's display name
  declare email: string | null; // User's email address
  declare apiKey: string | null; // API key for SMS forwarding and external access
  declare lastLoginAt: Date | null; // Last login timestamp
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Google OAuth sub (external unique identifier)",
    },
    googleRefreshToken: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Google OAuth refresh token",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "User's display name from Google",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
      comment: "User's email address from Google",
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "API key for external integrations and SMS forwarding",
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Last login timestamp",
    },
  },
  {
    sequelize,
    tableName: "Users",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["googleId"],
      },
      {
        unique: true,
        fields: ["apiKey"],
        where: {
          apiKey: {
            [Op.ne]: null,
          },
        },
      },
      {
        fields: ["email"],
      },
    ],
  }
);
