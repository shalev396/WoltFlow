import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class Settings extends Model {
  declare id: number;
  declare userId: number; // Foreign key to Users table
  declare notificationSettingsId: number | null; // Foreign key to NotificationSettings table
  declare woltSettingsId: number | null; // Foreign key to WoltSettings table
  declare cibusSettingsId: number | null; // Foreign key to CibusSettings table
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Settings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // One settings record per user
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      comment: "Reference to the user",
    },

    notificationSettingsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "NotificationSettings",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      comment: "Reference to NotificationSettings table",
    },
    woltSettingsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "WoltSettings",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      comment: "Reference to WoltSettings table",
    },
    cibusSettingsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "CibusSettings",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      comment: "Reference to CibusSettings table",
    },
  },
  {
    sequelize,
    tableName: "Settings",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId"],
      },
      {
        fields: ["notificationSettingsId"],
      },
      {
        fields: ["woltSettingsId"],
      },
      {
        fields: ["cibusSettingsId"],
      },
    ],
  }
);

// Relationships are defined in models/index.ts to avoid circular dependencies
