import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Clear the session cookie by setting Max-Age to 0
    const cookieSettings =
      process.env.ENV === "Development"
        ? "HttpOnly; SameSite=Lax; Path=/"
        : "HttpOnly; Secure; SameSite=Strict; Path=/";

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `sessionToken=; ${cookieSettings}; Max-Age=0`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          process.env.ENV === "Development"
            ? "http://localhost:5173"
            : "https://your-production-domain.com",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({ message: "Logged out successfully" }),
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          process.env.ENV === "Development"
            ? "http://localhost:5173"
            : "https://your-production-domain.com",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({ error: "Failed to logout" }),
    };
  }
};
