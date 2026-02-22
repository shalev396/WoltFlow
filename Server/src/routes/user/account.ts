import { Router } from "express";
import { UserController } from "../../controllers/index.js";

const router = Router();

export interface ExportUserDataResponseData {
  downloadUrl: string;
  filename: string;
  size: number;
  expiresIn: string;
}

router.get("/export", UserController.exportUserData);

export interface DeleteUserResponseData {
  message: string;
}

router.delete("/delete", UserController.deleteUserAccount);

export { router as accountRouter };
