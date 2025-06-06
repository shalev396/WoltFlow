import { APIGatewayProxyEvent, Context } from "aws-lambda";

export interface ICustomAPIGatewayProxyEvent extends APIGatewayProxyEvent {
  userId?: string;
}

export interface ICustomContext extends Context {
  userId?: string;
}
