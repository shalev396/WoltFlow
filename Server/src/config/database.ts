import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl =
  process.env.ENV === "Development"
    ? process.env.DATABASE_URL_DEV!
    : process.env.DATABASE_URL!;

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectOptions: {
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false,
    // },
  },
  logging: process.env.ENV === "Development" ? console.log : false,
});

export default sequelize;
