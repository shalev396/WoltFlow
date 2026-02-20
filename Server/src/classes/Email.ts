import { type Model, Op, type Attributes, type WhereOptions } from "sequelize";
import EmailsModel from "../models/Emails.js";
import { Inbox as InboxModel } from "../models/index.js";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import type { NodeJsClient } from "@smithy/types";
type EmailsWithInbox = EmailsModel & { inbox?: InboxModel };
import type {
  InboxResponseData,
  DownloadAttachmentResponseData,
} from "../routes/user/inbox.js";

type EmailAttributes = Omit<EmailsModel, keyof Model | "dataExpiresAt">;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
}) as NodeJsClient<S3Client>;

export class Email {
  private _id: EmailAttributes["id"];
  private _inboxId: EmailAttributes["inboxId"];
  private _s3EmailUrl: EmailAttributes["s3EmailUrl"];
  private _attachmentUrls: EmailAttributes["attachmentUrls"];
  private _fromEmail: EmailAttributes["fromEmail"];
  private _fromName: EmailAttributes["fromName"];
  private _toEmail: EmailAttributes["toEmail"];
  private _toName: EmailAttributes["toName"];
  private _subject: EmailAttributes["subject"];
  private _body: EmailAttributes["body"];
  private _emailDate: EmailAttributes["emailDate"];
  private _createdAt: EmailAttributes["createdAt"];
  private _updatedAt: EmailAttributes["updatedAt"];

  constructor(data: EmailAttributes) {
    this._id = data.id;
    this._inboxId = data.inboxId;
    this._s3EmailUrl = data.s3EmailUrl;
    this._attachmentUrls = data.attachmentUrls;
    this._fromEmail = data.fromEmail;
    this._fromName = data.fromName;
    this._toEmail = data.toEmail;
    this._toName = data.toName;
    this._subject = data.subject;
    this._body = data.body;
    this._emailDate = data.emailDate;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  // ==================== Getters ====================

  get id(): string {
    return this._id;
  }

  get inboxId(): string {
    return this._inboxId;
  }

  get s3EmailUrl(): string {
    return this._s3EmailUrl;
  }

  get attachmentUrls(): string[] | null {
    return this._attachmentUrls;
  }

  get fromEmail(): string {
    return this._fromEmail;
  }

  get fromName(): string | null {
    return this._fromName;
  }

  get toEmail(): string {
    return this._toEmail;
  }

  get toName(): string | null {
    return this._toName;
  }

  get subject(): string {
    return this._subject;
  }

  get body(): string | null {
    return this._body;
  }

  get emailDate(): Date {
    return this._emailDate;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ==================== Instance Methods ====================

  toJSON(): EmailAttributes {
    return {
      id: this._id,
      inboxId: this._inboxId,
      s3EmailUrl: this._s3EmailUrl,
      attachmentUrls: this._attachmentUrls,
      fromEmail: this._fromEmail,
      fromName: this._fromName,
      toEmail: this._toEmail,
      toName: this._toName,
      subject: this._subject,
      body: this._body,
      emailDate: this._emailDate,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  // ==================== Static Methods ====================

  /**
   * Get paginated emails for an inbox with optional date filters.
   * Returns the formatted response data for the inbox endpoint.
   */
  static async getForInbox(
    inboxId: string,
    inbox: {
      id: string;
      userId: string;
      emailAddress: string;
      createdAt: Date;
      updatedAt: Date;
    },
    options: {
      page: number;
      limit: number;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<InboxResponseData> {
    const { page, limit, startDate, endDate } = options;
    const offset = (page - 1) * limit;

    const whereConditions: WhereOptions<Attributes<EmailsModel>> = {
      inboxId,
    };

    if (startDate || endDate) {
      type DateRange = {
        [Op.gte]?: Date;
        [Op.lte]?: Date;
      };

      const createdAtFilter: DateRange = {};
      if (startDate) {
        createdAtFilter[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        createdAtFilter[Op.lte] = new Date(endDate);
      }

      Object.assign(whereConditions, { createdAt: createdAtFilter });
    }

    const emailsQuery = await EmailsModel.findAndCountAll({
      where: whereConditions,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      attributes: [
        "id",
        "s3EmailUrl",
        "attachmentUrls",
        "fromEmail",
        "fromName",
        "toEmail",
        "toName",
        "subject",
        "createdAt",
        "updatedAt",
      ],
    });

    const totalPages = Math.ceil(emailsQuery.count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      inbox: {
        id: inbox.id,
        userId: inbox.userId,
        emailAddress: inbox.emailAddress,
        createdAt: inbox.createdAt,
        updatedAt: inbox.updatedAt,
      },
      emails: emailsQuery.rows.map((email) => ({
        id: email.id,
        s3EmailUrl: email.s3EmailUrl,
        attachmentUrls: email.attachmentUrls,
        fromEmail: email.fromEmail,
        fromName: email.fromName,
        toEmail: email.toEmail,
        toName: email.toName,
        subject: email.subject,
        createdAt: email.createdAt,
        updatedAt: email.updatedAt,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: emailsQuery.count,
        limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      filters: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
    };
  }

  /**
   * Download an email attachment from S3, verifying the email belongs to the user.
   */
  static async downloadAttachment(
    emailId: string,
    userId: string,
    attachmentIndex: number,
  ): Promise<DownloadAttachmentResponseData> {
    const email =
      ((await EmailsModel.findOne({
        where: { id: emailId },
        include: [
          {
            model: InboxModel,
            as: "inbox",
            where: { userId },
            required: true,
          },
        ],
      })) as EmailsWithInbox) || null;

    if (!email) {
      throw new Error(
        "Email not found or you don't have permission to access it",
      );
    }

    if (
      !email.attachmentUrls ||
      attachmentIndex >= email.attachmentUrls.length
    ) {
      throw new Error("Attachment not found");
    }

    const attachmentUrl = email.attachmentUrls[attachmentIndex];
    if (!attachmentUrl) {
      throw new Error("Attachment URL is missing");
    }

    const s3UrlMatch = attachmentUrl.match(/^s3:\/\/([^/]+)\/(.+)$/);
    if (!s3UrlMatch || s3UrlMatch.length < 3) {
      throw new Error("Invalid attachment URL format");
    }

    const [, bucketName, objectKey] = s3UrlMatch;
    if (!bucketName || !objectKey) {
      throw new Error("Invalid S3 bucket or key");
    }

    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const s3Response = await s3.send(getObjectCommand);
    if (!s3Response.Body) {
      throw new Error("Attachment file not found in storage");
    }

    const stream = s3Response.Body as Readable;
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    const fileBuffer = Buffer.concat(chunks);
    const base64Content = fileBuffer.toString("base64");

    const filename = objectKey.split("/").pop() || "attachment";
    const contentType = s3Response.ContentType || "application/octet-stream";

    return {
      filename,
      contentType,
      content: base64Content,
    };
  }

  /**
   * Search for a Wolt gift card email in a specific inbox and date range.
   */
  static async findWoltGiftEmail(
    inboxId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Email | null> {
    const subject = "הגיפט קארד של Wolt הגיע ומחכה לשליחה :)";

    const result = await EmailsModel.findOne({
      where: {
        inboxId,
        fromEmail: "info@wolt.com",
        subject,
        emailDate: {
          [Op.between]: [startDate, endDate],
        },
        attachmentUrls: {
          [Op.ne]: null,
        },
      },
      order: [["emailDate", "DESC"]],
    });

    if (!result) return null;
    return new Email(result);
  }

  /**
   * Re-fetch an email's attachment URLs from the database.
   * Used during retry loops when waiting for attachment processing.
   */
  static async getAttachmentUrls(emailId: string): Promise<string[] | null> {
    const result = await EmailsModel.findByPk(emailId, {
      attributes: ["attachmentUrls"],
    });
    return result?.attachmentUrls ?? null;
  }
}
