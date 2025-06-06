import { ICustomAPIGatewayProxyEvent } from "./aws";

export interface IAuthenticatedEvent extends ICustomAPIGatewayProxyEvent {
  userId: string;
}

export interface IErrorResponse {
  message: string;
  statusCode: number;
}
