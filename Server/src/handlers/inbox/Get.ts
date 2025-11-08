import { Inbox, Emails, User } from "../../models/index.js";
import { authMiddleware } from "../../middlewares/auth.js";
import {
  type CustomAPIGatewayProxyHandler,
  type ICustomAPIGatewayProxyEventPaginate,
  type InboxWithUser,
} from "../../types/index.js";
import { initDB } from "../../config/bootstrap.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getErrorMessage,
} from "../../utils/responseUtil.js";
import { type Attributes, Op, type WhereOptions } from "sequelize";

// Connect to database
await initDB();
export const handler: CustomAPIGatewayProxyHandler = authMiddleware(
  async (event: ICustomAPIGatewayProxyEventPaginate) => {
    try {
      const userId = event.userId!;
      const queryParams = event.queryStringParameters || {};

      // Parse pagination parameters
      const page = parseInt(queryParams.page || "1", 10);
      const limit = Math.min(parseInt(queryParams.limit || "20", 10), 100);
      const offset = (page - 1) * limit;

      // Build where conditions for email filtering
      const whereConditions: WhereOptions<Attributes<Emails>> = {};
      if (queryParams.startDate || queryParams.endDate) {
        // type for symbol-keyed date operators
        type DateRange = {
          [Op.gte]?: Date;
          [Op.lte]?: Date;
        };

        const createdAtFilter: DateRange = {};
        if (queryParams.startDate) {
          createdAtFilter[Op.gte] = new Date(queryParams.startDate);
        }
        if (queryParams.endDate) {
          createdAtFilter[Op.lte] = new Date(queryParams.endDate);
        }

        // assign in one shot (no readonly mutation, no symbol-indexing on `{}`)
        Object.assign(whereConditions, { createdAt: createdAtFilter });
      }

      // Get or create user's inbox
      let inbox = (await Inbox.findOne({
        where: { userId },
        include: [
          {
            model: User,
            as: "user",
            // attributes: ["id", "name", "email"],
          },
        ],
      })) as InboxWithUser;

      // If no inbox exists, create one
      if (!inbox) {
        const customEmailAddress = `${userId}@${process.env.EMAIL_SUBDOMAIN}`;

        const newinbox = await Inbox.create({
          userId,
          emailAddress: customEmailAddress,
        });

        // Reload with user information
        inbox = (await Inbox.findByPk(newinbox.id, {
          include: [
            {
              model: User,
              as: "user",
              // attributes: ["id", "name", "email"],
            },
          ],
        })) as InboxWithUser;
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
          createdAt: inbox!.createdAt,
          updatedAt: inbox!.updatedAt,
          user: inbox.user,
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
          startDate: queryParams.startDate,
          endDate: queryParams.endDate,
        },
      });
    } catch (error) {
      console.error("Error in getInbox handler:", error);
      return createErrorResponse(getErrorMessage(error));
    }
  }
);
