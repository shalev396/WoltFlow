import { APIGatewayProxyResult } from "aws-lambda";

const ENV = process.env["ENV"];

/**
 * Extracts error message from error object, respecting environment settings
 */
export function getErrorMessage(error: unknown): string {
  if (ENV === "prod") {
    return "Internal server error";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown error occurred";
}

export interface SuccessResponseData {
  success: true;
  message: string;
  data?: any;
}

export interface ErrorResponseData {
  success: false;
  message: string;
}

/**
 * Creates a standardized success response for API Gateway
 */
export function createSuccessResponse(
  message: string,
  data?: any,
  statusCode: number = 200
): APIGatewayProxyResult {
  const responseBody: SuccessResponseData = {
    success: true,
    message,
    ...(data && { data }), // Only include data if it exists
  };

  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Credentials": "true",
    },
    body: JSON.stringify(responseBody),
  };
}

/**
 * Creates a standardized error response for API Gateway
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 500
): APIGatewayProxyResult {
  const responseBody: ErrorResponseData = {
    success: false,
    message,
  };

  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Credentials": "true",
    },
    body: JSON.stringify(responseBody),
  };
}

/**
 * Creates a standardized success response data object (for non-HTTP responses like Step Functions)
 */
export function createSuccessData(
  message: string,
  data?: any
): SuccessResponseData {
  return {
    success: true,
    message,
    ...(data && { data }),
  };
}

/**
 * Creates a standardized error data object (for non-HTTP responses like Step Functions)
 */
export function createErrorData(message: string): ErrorResponseData {
  return {
    success: false,
    message,
  };
}
