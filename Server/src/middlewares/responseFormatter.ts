import {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
  type ErrorRequestHandler,
} from "express";
/// <reference path="../types/express-extensions.d.ts" />

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

export const responseFormatter: RequestHandler = (
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.success = function <T>(data: T, statusCode = 200): void {
    this.status(statusCode).json({
      success: true,
      data,
    });
  };

  res.error = function (message: string, statusCode = 500): void {
    this.status(statusCode).json({
      success: false,
      message,
    });
  };

  next();
};

export const errorHandler: ErrorRequestHandler = (
  error: ErrorWithStatusCode,
  _req: Request,
  res: Response,
): void => {
  console.error("Error:", error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export const notFound: RequestHandler = (
  _req: Request,
  res: Response,
): void => {
  res.status(404).json({
    success: false,
    message: "Not found",
  });
};
