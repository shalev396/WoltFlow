import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pg from "pg";

// Environment variables
dotenv.config();

const ENV = process.env["ENV"];
let ENV_DATABASE_URL = "";
if (ENV === "prod") {
  ENV_DATABASE_URL = process.env["DATABASE_URL_PROD"] || "";
} else if (ENV === "dev") {
  ENV_DATABASE_URL = process.env["DATABASE_URL_DEV"] || "";
} else if (ENV === "local") {
  ENV_DATABASE_URL = process.env["DATABASE_URL_LOCAL"] || "";
}
const databaseUrl = ENV_DATABASE_URL;

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl:
      ENV !== "local"
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

// Sync database in development mode
// if (process.env.ENV === "Development") {
// await sequelize.sync({ alter: true }).catch((err) => {
//   console.error("Error syncing database:", err);
// });
// }

export default sequelize;
