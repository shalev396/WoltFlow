import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { verifyToken } from "./auth";
import { CustomRequest } from "../types";

export const authMiddleware = async (
  event: APIGatewayProxyEvent
): Promise<CustomRequest | APIGatewayProxyResult> => {
  try {
    const token = event.headers.Authorization?.split(" ")[1];
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "No token provided" }),
      };
    }

    const decoded = verifyToken(token);
    return {
      ...event,
      user: decoded,
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Invalid token" }),
    };
  }
};

export const errorHandler = (error: any): APIGatewayProxyResult => {
  console.error("Error:", error);

  return {
    statusCode: error.statusCode || 500,
    body: JSON.stringify({
      message: error.message || "Internal server error",
      statusCode: error.statusCode || 500,
    }),
  };
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};
