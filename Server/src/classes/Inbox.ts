import { type Model } from "sequelize";
import InboxModel from "../models/Inbox.js";
import { User as UserModel } from "../models/index.js";

type InboxWithUser = InboxModel & { user?: UserModel };

type InboxAttributes = Omit<InboxModel, keyof Model>;

export class Inbox {
  private _id: InboxAttributes["id"];
  private _userId: InboxAttributes["userId"];
  private _emailAddress: InboxAttributes["emailAddress"];
  private _createdAt: InboxAttributes["createdAt"];
  private _updatedAt: InboxAttributes["updatedAt"];

  constructor(data: InboxAttributes) {
    this._id = data.id;
    this._userId = data.userId;
    this._emailAddress = data.emailAddress;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  // ==================== Getters ====================

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get emailAddress(): string {
    return this._emailAddress;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ==================== Instance Methods ====================

  toJSON(): InboxAttributes {
    return {
      id: this._id,
      userId: this._userId,
      emailAddress: this._emailAddress,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  // ==================== Static Methods ====================

  /**
   * Find or create an inbox for a user. Creates with a generated email address
   * if one doesn't exist. Single compound operation.
   */
  static async findOrCreateForUser(userId: string): Promise<Inbox> {
    let inbox = (await InboxModel.findOne({
      where: { userId },
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    })) as InboxWithUser | null;

    if (!inbox) {
      const customEmailAddress = `${userId}@${process.env.EMAIL_SUBDOMAIN}`;

      const newInbox = await InboxModel.create({
        userId,
        emailAddress: customEmailAddress,
      });

      inbox = (await InboxModel.findByPk(newInbox.id, {
        include: [
          {
            model: UserModel,
            as: "user",
          },
        ],
      })) as InboxWithUser;
    }

    return new Inbox(inbox);
  }
}
