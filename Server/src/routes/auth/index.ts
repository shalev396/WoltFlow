import { Router } from "express";
import { AuthController } from "../../controllers/index.js";

const router = Router();

// Request/Response types for signup
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

// Request/Response types for confirm signup
export interface ConfirmSignupRequestBody {
  email: string;
  code: string;
}
router.post("/confirm", AuthController.confirmSignup);

// Request/Response types for login
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

// Request/Response types for forgot password
export interface ForgotPasswordRequestBody {
  email: string;
}
router.post("/forgot-password", AuthController.forgotPassword);

// Request/Response types for reset password
export interface ResetPasswordRequestBody {
  email: string;
  code: string;
  password: string;
}
router.post("/reset-password", AuthController.resetPassword);

// Request/Response types for refresh token
export interface RefreshTokenRequestBody {
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  idToken: string;
  accessToken: string;
  expiresIn: number;
}

router.post("/refresh", AuthController.refreshToken);

export { router as authRouter };
