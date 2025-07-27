import sequelize from "./database.js";
import dotenv from "dotenv";
import "../models/Code.js";
import "../models/Run.js";
import "../models/Screenshot.js";
import "../models/Setting.js";
import "../models/TwoFA.js";
import "../models/User.js";

// import any other models here
dotenv.config();

// Export a function to sync database instead of doing it at module load time
export async function syncDatabase() {
  if (
    process.env["ENV"] === "local" //||true // uncomment to sync database on PROD
  ) {
    try {
      await sequelize
        .sync({ alter: true })
        .then(() => {
          console.log("✅ Database synchronized");
        })
        .catch((err) => {
          console.error("❌ Sync error:", err);
          throw err;
        });
    } catch (err) {
      console.error("❌ Sync error:", err);
      throw err;
    }
  }
}
