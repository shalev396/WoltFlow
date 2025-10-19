import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pg from "pg";

// Environment variables
console.log("DATABASE_URL", process.env.DATABASE_URL);
dotenv.config();
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 60000,
    statement_timeout: 60000,
  },
  logging: false,
});

export default sequelize;
