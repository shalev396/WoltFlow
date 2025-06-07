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

// Sync database in development mode
if (process.env.ENV === "Development") {
  sequelize.sync({ alter: true }).catch((err) => {
    console.error("Error syncing database:", err);
  });
}

export default sequelize;
