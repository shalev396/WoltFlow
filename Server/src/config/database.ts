import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const databaseUrl =
  process.env["ENV"] === "Development"
    ? process.env["DATABASE_URL_DEV"]!
    : process.env["DATABASE_URL"]!;

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl:
      process.env["ENV"] === "Production"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : undefined,
  },
  logging: process.env["ENV"] === "Development" ? console.log : false,
});

// Sync database in development mode
// if (process.env.ENV === "Development") {
sequelize.sync({ alter: true }).catch((err) => {
  console.error("Error syncing database:", err);
});
// }

export default sequelize;
