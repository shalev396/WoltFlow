import express from "express";
import serverlessHttp from "serverless-http";
import {
  responseFormatter,
  errorHandler,
  notFound,
} from "../../middlewares/index.js";
import { authRouter } from "../../routes/index.js";
import { initDB } from "../../config/bootstrap.js";

// Initialize database
await initDB();
// await syncDatabase();

// Create Express app for public auth routes
const authApp = express();

// Body parsing middleware
authApp.use(express.json());
authApp.use(express.urlencoded({ extended: true }));

// Response formatter middleware
authApp.use(responseFormatter);

// Public auth routes - NO authentication required
authApp.use("/api/auth", authRouter);

// Error handling
authApp.use(notFound);
authApp.use(errorHandler);

// Export handler for Lambda
export const handler = serverlessHttp(authApp);
