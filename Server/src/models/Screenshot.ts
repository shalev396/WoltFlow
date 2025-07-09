import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Run from "./Run";

class Screenshot extends Model {
  declare id: number;
  declare run_id: number;
  declare url: string;
  declare is_error: boolean;
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
    tableName: "Screenshots",
    timestamps: false,
  }
);

Screenshot.belongsTo(Run, { foreignKey: "run_id" });
Run.hasMany(Screenshot, { foreignKey: "run_id" });

export default Screenshot;
