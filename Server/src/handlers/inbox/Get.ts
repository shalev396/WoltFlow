import { Inbox, Emails, User } from "../../models/index.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
import { ICustomAPIGatewayProxyEventAuth } from "../../typescript/interfaces/aws.js";
import sequelize from "../../config/database.js";
import { syncDatabase } from "../../config/bootstrap.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../utils/responseUtil.js";
import { Op } from "sequelize";

// Connect to database
await sequelize.authenticate();
await syncDatabase();
// Get the current stage/environment
const ENV = process.env["ENV"] || "dev"; // Default to dev
console.log("Current ENV:", ENV);

// Get the email subdomain based on environment
let emailSubdomain = "";
if (ENV === "prod") {
  emailSubdomain = process.env["EMAIL_SUBDOMAIN_PROD"] || "";
} else if (ENV === "dev") {
  emailSubdomain = process.env["EMAIL_SUBDOMAIN_DEV"] || "";
} else if (ENV === "local") {
  emailSubdomain = process.env["EMAIL_SUBDOMAIN_LOCAL"] || "";
}

// Fallback to dev subdomain if empty
if (!emailSubdomain) {
  emailSubdomain = "dev.users.woltflow.shalev396.com";
  console.warn("Using fallback email subdomain:", emailSubdomain);
} else {
  console.log("Using email subdomain:", emailSubdomain);
}
export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventAuth) => {
    try {
      const userId = event.userId!;
      const queryParams = event.queryStringParameters || {};

      // Parse pagination parameters
      const page = parseInt(queryParams["page"] || "1", 10);
      const limit = Math.min(parseInt(queryParams["limit"] || "20", 10), 100);
      const offset = (page - 1) * limit;

      // Build where conditions for email filtering
      const whereConditions: any = {};

      if (queryParams["startDate"] || queryParams["endDate"]) {
        whereConditions.createdAt = {};
        if (queryParams["startDate"]) {
          whereConditions.createdAt[Op.gte] = new Date(
            queryParams["startDate"]
          );
        }
        if (queryParams["endDate"]) {
          whereConditions.createdAt[Op.lte] = new Date(queryParams["endDate"]);
        }
      }

      // Get or create user's inbox
      let inbox = await Inbox.findOne({
        where: { userId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      // If no inbox exists, create one
      if (!inbox) {
        const customEmailAddress = `${userId}@${emailSubdomain}`;

        inbox = await Inbox.create({
          userId,
          emailAddress: customEmailAddress,
          sesVerificationStatus: "pending",
        });

        // Reload with user information
        inbox = await Inbox.findByPk(inbox.id, {
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      }

      // Get emails for this inbox with filtering and pagination
      const emailsQuery = await Emails.findAndCountAll({
        where: {
          inboxId: inbox!.id,
          ...whereConditions,
        },
        order: [["createdAt", "DESC"]],
        limit,
        offset,
        attributes: [
          "id",
          "s3EmailUrl",
          "attachmentUrls",

          // Email content fields
          "fromEmail",
          "fromName",
          "toEmail",
          "toName",
          "subject",
          "body",
          "emailDate",

          "createdAt",
          "updatedAt",
        ],
      });

      // Calculate pagination metadata
      const totalEmails = emailsQuery.count;
      const totalPages = Math.ceil(totalEmails / limit);

      return createSuccessResponse("Inbox and emails retrieved successfully", {
        inbox: {
          id: inbox!.id,
          emailAddress: inbox!.emailAddress,
          sesVerificationStatus: inbox!.sesVerificationStatus,
          createdAt: inbox!.createdAt,
          updatedAt: inbox!.updatedAt,
          user: (inbox as any).user,
        },
        emails: emailsQuery.rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalEmails,
          emailsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters: {
          startDate: queryParams["startDate"] || null,
          endDate: queryParams["endDate"] || null,
        },
      });
    } catch (error) {
      console.error("Error in getInbox handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
