import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { Run as RunType } from "../types";
import User from "./User";

class Run extends Model<RunType> implements RunType {
  public id!: number;
  public user_id!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public status!: "failed" | "in progress" | "success";
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
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("failed", "in progress", "success"),
      allowNull: false,
      defaultValue: "in progress",
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
    tableName: "runs",
    timestamps: false,
  }
);

Run.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Run, { foreignKey: "user_id" });

export default Run;
