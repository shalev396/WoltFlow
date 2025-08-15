import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export default class Settings extends Model {
  declare id: string;
  declare userId: string; // Foreign key to Users table
  declare notificationSettingsId: string | null; // Foreign key to NotificationSettings table
  declare woltSettingsId: string | null; // Foreign key to WoltSettings table
  declare cibusSettingsId: string | null; // Foreign key to CibusSettings table
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Settings.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      comment: "Reference to the user",
    },

    notificationSettingsId: {
      type: DataTypes.UUID,
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
      type: DataTypes.UUID,
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
      type: DataTypes.UUID,
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
