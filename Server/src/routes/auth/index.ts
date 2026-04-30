import { Router } from "express";
import { AuthController } from "../../controllers/index.js";
import { syncDatabase } from "../../config/bootstrap.js";

const router = Router();

export interface SignupRequestBody {
  email: string;
  password: string;
  name: string;
}

export interface SignupResponseData {
  userSub: string;
  userConfirmed: boolean;
}

router.post("/signup", AuthController.signup);

export interface ConfirmSignupRequestBody {
  email: string;
  code: string;
}

router.post("/confirm", AuthController.confirmSignup);

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: {
    id: string;
    email: string;
    name: string;
  };
  tokens: {
    idToken: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

router.post("/login", AuthController.login);

export interface ForgotPasswordRequestBody {
  email: string;
}

router.post("/forgot-password", AuthController.forgotPassword);

export interface ResetPasswordRequestBody {
  email: string;
  code: string;
  password: string;
}

router.post("/reset-password", AuthController.resetPassword);

export interface RefreshTokenRequestBody {
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  idToken: string;
  accessToken: string;
  expiresIn: number;
}

router.post("/refresh", AuthController.refreshToken);

// =====================================================================
// ⚠️ TEMPORARY ONE-SHOT MIGRATION ENDPOINT — DELETE AFTER FIRST RUN ⚠️
// ---------------------------------------------------------------------
// Hits `syncDatabase()` from bootstrap, which runs the destructive
// schema cleanup once (drops Inbox/Emails/Codes, automationMode columns,
// shrinks Runs.stage enum) and then `sequelize.sync({ alter: true })`.
//
// HOW TO REMOVE (once every environment has been migrated):
//   1. Delete everything between the "BEGIN" / "END" markers below
//      (including the markers, the route, and the surrounding banner).
//   2. Drop the `import { syncDatabase } from ".../bootstrap.js";`
//      added near the top of this file.
//   3. Pair this with removing `cleanupObsoleteSchema()` per the banner
//      in `Server/src/config/bootstrap.ts`.
//
// Hit it with `POST /api/auth/sync-database` (no auth required, but the
// underlying SQL is idempotent — re-runs are safe no-ops).
// =====================================================================
// BEGIN: TEMPORARY SYNC-DATABASE ENDPOINT — remove from here ↓
router.post("/sync-database", async (_req, res, next) => {
  try {
    await syncDatabase();
    res.success({ ok: true, message: "syncDatabase completed" });
  } catch (err) {
    next(err);
  }
});
// END: TEMPORARY SYNC-DATABASE ENDPOINT — stop removing here ↑

export { router as authRouter };
