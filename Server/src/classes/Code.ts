import { type Model } from "sequelize";
import CodeModel from "../models/Code.js";

type CodeAttributes = Omit<CodeModel, keyof Model | "dataExpiresAt">;

export class Code {
  private _id: CodeAttributes["id"];
  private _userId: CodeAttributes["userId"];
  private _runId: CodeAttributes["runId"];
  private _emailId: CodeAttributes["emailId"];
  private _code: CodeAttributes["code"];
  private _isUsed: CodeAttributes["isUsed"];
  private _createdAt: CodeAttributes["createdAt"];
  private _updatedAt: CodeAttributes["updatedAt"];

  constructor(data: CodeAttributes) {
    this._id = data.id;
    this._userId = data.userId;
    this._runId = data.runId;
    this._emailId = data.emailId;
    this._code = data.code;
    this._isUsed = data.isUsed;
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

  get runId(): string | null {
    return this._runId;
  }

  get emailId(): string | null {
    return this._emailId;
  }

  get code(): string {
    return this._code;
  }

  get isUsed(): boolean {
    return this._isUsed;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ==================== Instance Methods ====================

  toJSON(): CodeAttributes {
    return {
      id: this._id,
      userId: this._userId,
      runId: this._runId,
      emailId: this._emailId,
      code: this._code,
      isUsed: this._isUsed,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  // ==================== Static Methods ====================

  static async createFromEmail(
    userId: string,
    runId: string,
    emailId: string,
    codeValue: string,
  ): Promise<Code> {
    const record = await CodeModel.create({
      userId,
      runId,
      emailId,
      code: codeValue,
      isUsed: false,
    });
    return new Code(record);
  }

  static async findLatestUnused(userId: string): Promise<Code | null> {
    const result = await CodeModel.findOne({
      where: { userId, isUsed: false },
      order: [["createdAt", "DESC"]],
    });
    if (!result) return null;
    return new Code(result);
  }

  static async markAsUsed(codeId: string): Promise<void> {
    await CodeModel.update({ isUsed: true }, { where: { id: codeId } });
  }
}
