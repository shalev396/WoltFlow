import sequelize from "./database.js";
import dotenv from "dotenv";
import { initializeModelRelationships } from "../models/index.js";

// Import all new models
import "../models/index.js";

dotenv.config();

// Export a function to sync database instead of doing it at module load time
export async function syncDatabase() {
  if (
    process.env["ENV"] === "local" ||
    true // uncomment to sync database on PROD
  ) {
    try {
      // Initialize model relationships before syncing
      initializeModelRelationships();

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
