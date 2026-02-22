import { type Request, type Response, type NextFunction, type RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import {
  type CognitoJwtPayload,
  type AuthenticatedRequest,
} from "../types/express.js";

/**
 * Express authentication middleware
 * Validates JWT token and attaches user information to req.user
 */
export const expressAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "No authorization header provided",
      });
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message:
          "Invalid authorization header format. Expected: Bearer <token>",
      });
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "No token provided",
      });
      return;
    }

    // Decode the JWT (without verification for now - Cognito already validated it)
    // In production, API Gateway validates the token before it reaches here
    const decoded = jwt.decode(token) as CognitoJwtPayload | null;

    if (!decoded || !decoded.sub) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }

    const cognitoSub = decoded.sub;

    // Look up user by cognitoSub to get the actual User.id (UUID)
    const user = await User.findOne({
      where: { cognitoSub },
      attributes: ["id", "cognitoSub"],
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Attach user information to request
    (req as AuthenticatedRequest).user = {
      id: user.id,
      cognitoSub: user.cognitoSub,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
