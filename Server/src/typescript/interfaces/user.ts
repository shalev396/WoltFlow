export interface IUser {
  id?: number;
  userId: string;
  email: string;
  refreshToken: string;
  in_notification: boolean;
  total_saved: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITokenPayload {
  userId: string;
  email: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<IUser, "refreshToken">;
}
