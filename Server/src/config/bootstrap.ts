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
// Now that models are registered, sync them:
if (
  process.env["ENV"] === "Development" //|| true // uncomment to sync database on PROD
) {
  await sequelize
    .sync({ alter: true })
    .then(() => console.log("✅ Database synchronized"))
    .catch((err) => console.error("❌ Sync error:", err));
}
