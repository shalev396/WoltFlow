import { APIGatewayProxyResult } from "aws-lambda";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const isSecure = process.env.IS_LOCAL !== "true";
  const secureCookie = isSecure ? "; Secure" : "";

  return {
    statusCode: 200,
    headers: {
      "Set-Cookie": [
        `idToken=; HttpOnly${secureCookie}; Path=/; Max-Age=0; SameSite=Lax`,
        `refreshToken=; HttpOnly${secureCookie}; Path=/; Max-Age=0; SameSite=Lax`,
      ].join(", "),
    },
    body: JSON.stringify({
      success: true,
      message: "Logged out successfully",
    }),
  };
};
