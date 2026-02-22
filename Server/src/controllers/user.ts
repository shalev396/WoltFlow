import { type RequestHandler } from "express";
import { User } from "../classes/index.js";
import { type AuthenticatedRequest } from "../types/express.js";
import type { DeleteUserResponseData } from "../routes/user/account.js";

export class UserController {
  static exportUserData: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const cognitoSub = authReq.user.cognitoSub;

      const data = await User.exportData(userId, cognitoSub);
      res.success(data);
    } catch (error) {
      console.error("Error in user data export:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to export user data";
      const statusCode = errorMessage === "User not found" ? 404 : 500;
      res.error(errorMessage, statusCode);
    }
  };

  static deleteUserAccount: RequestHandler = async (req, res): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const cognitoSub = authReq.user.cognitoSub;

      await User.deleteAccount(userId, cognitoSub);

      const data: DeleteUserResponseData = {
        message: "All user data has been permanently deleted",
      };

      res.success(data);
    } catch (error) {
      console.error("Error deleting user account:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete user account";
      const statusCode = errorMessage === "User not found" ? 404 : 500;
      res.error(errorMessage, statusCode);
    }
  };
}
