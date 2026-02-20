import express from "express";
import serverlessHttp from "serverless-http";
import {
  responseFormatter,
  errorHandler,
  notFound,
  expressAuth,
} from "../../middlewares/index.js";
import { userRouter } from "../../routes/index.js";
import { initDB } from "../../config/bootstrap.js";

// Initialize database
await initDB();
// await syncDatabase();

// Create Express app for protected user routes
const userApp = express();

// Body parsing middleware
userApp.use(express.json());
userApp.use(express.urlencoded({ extended: true }));

// Response formatter middleware
userApp.use(responseFormatter);

// Apply authentication middleware to ALL user routes
userApp.use(expressAuth);

// Protected user routes - authentication required
userApp.use("/api/user", userRouter);

// Error handling
userApp.use(notFound);
userApp.use(errorHandler);

// Export handler for Lambda
export const handler = serverlessHttp(userApp);
