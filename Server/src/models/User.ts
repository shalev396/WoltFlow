import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class User extends Model {
  declare id: string;
  declare cognitoSub: string;
  declare name: string | null;
  declare email: string | null;
  declare lastLoginAt: Date | null;
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
    cognitoSub: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Cognito sub (unique external identifier)",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "User's display name",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
      comment: "User's email address",
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
        fields: ["cognitoSub"],
      },
      {
        fields: ["email"],
      },
    ],
  }
);
