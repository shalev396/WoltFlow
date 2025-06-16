import { APIGatewayProxyEventV2 } from "aws-lambda";
// import { google } from "googleapis";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import sequelize from "../../config/database";
import { OAuth2Client } from "google-auth-library"; // Standalone auth library
import { oauth2_v2 } from "@googleapis/oauth2";

export const handler = async (event: APIGatewayProxyEventV2) => {
  try {
    const isDev = process.env.ENV === "Development";
    const oauthRedirectUri = isDev
      ? process.env.OAUTH_REDIRECT_URI_DEV!
      : process.env.OAUTH_REDIRECT_URI!;
    // 1. Ensure DB connection
    await sequelize.authenticate();

    // 2. Parse cookies to get sessionToken
    const cookieHeader =
      (event.cookies && event.cookies.join("; ")) ||
      event.headers["cookie"] ||
      "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((p: string) => p.split("="))
    );
    const token = cookies["sessionToken"];

    // const cookieHeader = event.headers.Cookie || event.headers.cookie || "";
    // const cookies = Object.fromEntries(
    //   cookieHeader.split("; ").map((pair: string) => pair.split("="))
    // );
    // const token = cookies["sessionToken"];
    if (!token) throw new Error("No session token");

    // 3. Verify JWT and extract userId
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const userId = payload.userId;

    // 4. Fetch refresh_token from PostgreSQL
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    // 5. Refresh access token using OAuth2 client
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      oauthRedirectUri!
    );

    oauth2Client.setCredentials({ refresh_token: user.refreshToken });
    const newTokenResponse = await oauth2Client.getAccessToken();
    const newAccessToken = newTokenResponse.token;
    if (!newAccessToken) throw new Error("Failed to refresh access token");

    // 6. If Google rotated the refresh_token, update it
    if (newTokenResponse.res?.data?.refresh_token) {
      const rotatedRT = newTokenResponse.res.data.refresh_token;
      user.refreshToken = rotatedRT;
      await user.save();
    }

    // 7. Fetch user profile info
    oauth2Client.setCredentials({ access_token: newAccessToken });
    const oauth2Service = new oauth2_v2.Oauth2({
      auth: oauth2Client,
      // version: "v2"
    });
    const userInfo = await oauth2Service.userinfo.get();

    // 8. Return user info in JSON with CORS headers
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          process.env.ENV === "Development"
            ? "http://localhost:5173"
            : "https://woltflow.shalev396.com",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        email: userInfo.data.email,
        name: userInfo.data.name,
        picture: userInfo.data.picture,
      }),
    };
  } catch (err) {
    console.error("authMe error:", err);
    // 9. Clear session cookie on failure

    const cookieSettings =
      process.env.ENV === "Development"
        ? "HttpOnly; SameSite=Lax"
        : "HttpOnly; Secure; SameSite=Strict";

    return {
      statusCode: 401,
      headers: {
        "Set-Cookie": `sessionToken=; ${cookieSettings}; Max-Age=0`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          process.env.ENV === "Development"
            ? "http://localhost:5173"
            : "https://woltflow.shalev396.com",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        error: "Not authenticated",
      }),
    };
  }
};
