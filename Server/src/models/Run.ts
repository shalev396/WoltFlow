import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { Run as RunType } from "../typescript/types";
import User from "./User";

class Run extends Model<RunType> implements RunType {
  public id!: number;
  public user_id!: string;
  public created_at?: Date;
  public updated_at?: Date;
  public status!: "failed" | "in progress" | "success";
  public stage!:
    | "triggered"
    | "refreshing tokens"
    | "buying gift"
    | "getting code from mail"
    | "applying gift"
    | "done";
  public amount!: number;
  public is_notify!: boolean;
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
