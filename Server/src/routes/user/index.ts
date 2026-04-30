import { Router } from "express";
import { dashboardRouter } from "./dashboard.js";
import { runsRouter } from "./runs.js";
import { settingsRouter } from "./settings.js";
import { accountRouter } from "./account.js";

const router = Router();

// Mount sub-routes (auth middleware applied at app level)
router.use("/dashboard", dashboardRouter);
router.use("/runs", runsRouter);
router.use("/settings", settingsRouter);
router.use("/", accountRouter); // /user/export and /user/delete

export { router as userRouter };
