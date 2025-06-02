import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { User as UserType } from "../types";

class User extends Model<UserType> implements UserType {
  public id!: number;
  public email!: string;
  public password!: string;
  public in_notification!: boolean;
  public total_saved!: number;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    in_notification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    total_saved: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  }
);

export default User;
