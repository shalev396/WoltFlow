import { APIGatewayProxyEventV2 } from "aws-lambda";
import jwt from "jsonwebtoken";
import { User } from "../../models/index.js";
import sequelize from "../../config/database.js";
import { OAuth2Client } from "google-auth-library"; // Standalone auth library
import { oauth2_v2 } from "@googleapis/oauth2";
import dotenv from "dotenv";
import { syncDatabase } from "../../config/bootstrap.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../utils/responseUtil.js";

// Environment variables
dotenv.config();
const ENV = process.env["ENV"];

let ENV_OAUTH_REDIRECT_URI = "";
if (ENV === "prod") {
  ENV_OAUTH_REDIRECT_URI = process.env["OAUTH_REDIRECT_URI_PROD"] || "";
} else if (ENV === "dev") {
  ENV_OAUTH_REDIRECT_URI = process.env["OAUTH_REDIRECT_URI_DEV"] || "";
} else if (ENV === "local") {
  ENV_OAUTH_REDIRECT_URI = process.env["OAUTH_REDIRECT_URI_LOCAL"] || "";
}

await sequelize.authenticate();
await syncDatabase();

export const handler = async (event: APIGatewayProxyEventV2) => {
  try {
    const oauthRedirectUri = ENV_OAUTH_REDIRECT_URI;

    // 2. Parse cookies to get sessionToken
    const cookieHeader =
      (event.cookies && event.cookies.join("; ")) ||
      event.headers["cookie"] ||
      "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((p: string) => p.split("="))
    );
    const token = cookies["sessionToken"];
    if (!token) throw new Error("No session token");

    // 3. Verify JWT and extract internal userId (UUID)
    const payload = jwt.verify(token, process.env["JWT_SECRET"]!) as {
      userId: string;
    };
    const userId = payload.userId;

    // 4. Fetch user by internal UUID from PostgreSQL
    const user = await User.findByPk(userId);
    console.log("user", user);
    if (!user) throw new Error("User not found");

    // 5. Refresh access token using OAuth2 client
    const oauth2Client = new OAuth2Client(
      process.env["GOOGLE_CLIENT_ID"]!,
      process.env["GOOGLE_CLIENT_SECRET"]!,
      oauthRedirectUri!
    );

    oauth2Client.setCredentials({
      refresh_token: user.get("googleRefreshToken"),
    });
    const newTokenResponse = await oauth2Client.getAccessToken();
    const newAccessToken = newTokenResponse.token;
    if (!newAccessToken) throw new Error("Failed to refresh access token");
    console.log("newAccessToken", newAccessToken);
    // 6. If Google rotated the refresh_token, update it
    if (newTokenResponse.res?.data?.refresh_token) {
      const rotatedRT = newTokenResponse.res.data.refresh_token;
      user.set("googleRefreshToken", rotatedRT);
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
    return createSuccessResponse("User authenticated successfully", {
      user: {
        email: userInfo.data.email,
        name: userInfo.data.name,
        picture: userInfo.data.picture,
      },
    });
  } catch (err) {
    console.error("authMe error:", err);
    // 9. Clear session cookie on failure

    const cookieSettings =
      ENV === "local"
        ? "HttpOnly; SameSite=Lax"
        : "HttpOnly; Secure; SameSite=Strict";

    const errorResponse = createErrorResponse(getErrorMessage(err), 401);
    // Add cookie clearing header
    errorResponse.headers = {
      ...errorResponse.headers,
      "Set-Cookie": `sessionToken=; ${cookieSettings}; Max-Age=0`,
    };
    return errorResponse;
  }
};
