import { APIGatewayProxyEventV2 } from "aws-lambda";

export interface ICustomAPIGatewayProxyEvent extends APIGatewayProxyEventV2 {
  userId?: string;
}
