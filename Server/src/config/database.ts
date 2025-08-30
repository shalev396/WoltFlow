import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pg from "pg";

// Environment variables
dotenv.config();
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl:
      process.env.ENV !== "local"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : undefined,
    connectionTimeoutMillis: 60000,
    statement_timeout: 60000,
  },
  logging: false, //ENV === "local" ? console.log : false,
});

export default sequelize;
