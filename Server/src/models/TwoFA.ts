import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

export default class TwoFA extends Model {
  declare id: string; // UUID
  declare userId: string;
  declare method: "sms" | "email";
  declare contact: string; // E.164 phone number or email address
  declare code: string; // 6-digit verification code
  declare expiresAt: Date;
  declare verified: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TwoFA.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    method: {
      type: DataTypes.ENUM("sms", "email"),
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "TwoFA",
    sequelize,
    indexes: [
      {
        fields: ["userId", "method"],
      },
      {
        fields: ["expiresAt"],
      },
    ],
  }
);

TwoFA.belongsTo(User, { foreignKey: "userId" });
