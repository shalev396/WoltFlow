import { APIGatewayProxyEventV2, Context } from "aws-lambda";

export interface ICustomAPIGatewayProxyEvent extends APIGatewayProxyEventV2 {
  userId?: string;
}

export interface ICustomContext extends Context {
  userId?: string;
}
