import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { Screenshot as ScreenshotType } from "../typescript/types";
import Run from "./Run";

class Screenshot extends Model<ScreenshotType> implements ScreenshotType {
  public id!: number;
  public run_id!: number;
  public url!: string;
  public is_error!: boolean;
}

Screenshot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    run_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Run,
        key: "id",
      },
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_error: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "screenshots",
    timestamps: false,
  }
);

Screenshot.belongsTo(Run, { foreignKey: "run_id" });
Run.hasMany(Screenshot, { foreignKey: "run_id" });

export default Screenshot;
