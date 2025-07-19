import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

class Run extends Model {
  declare id: number;
  declare user_id: string;
  declare created_at?: Date;
  declare updated_at?: Date;
  declare status: "failed" | "in progress" | "success";
  declare stage:
    | "triggered"
    | "refreshing tokens"
    | "buying gift"
    | "getting code from mail"
    | "applying gift"
    | "done";
  declare amount: number;
  declare is_notify: boolean;
}

Run.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "userId",
      },
    },
    status: {
      type: DataTypes.ENUM("failed", "in progress", "success"),
      allowNull: false,
      defaultValue: "in progress",
    },
    stage: {
      type: DataTypes.ENUM(
        "triggered",
        "refreshing tokens",
        "buying gift",
        "getting code from mail",
        "applying gift",
        "done"
      ),
      allowNull: false,
      defaultValue: "triggered",
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    is_notify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "Runs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Run.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Run, { foreignKey: "user_id" });

export default Run;
