import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { ICustomAPIGatewayProxyEvent, ICustomContext } from "../interfaces/aws";

export interface CustomAPIGatewayProxyEvent extends APIGatewayProxyEvent {
  userId?: string;
}

export interface CustomContext extends Context {
  userId?: string;
}

export type CustomAPIGatewayProxyHandler = (
  event: ICustomAPIGatewayProxyEvent,
  context: ICustomContext,
  callback: (
    error?: Error | null | string,
    result?: APIGatewayProxyResult
  ) => void
) => Promise<APIGatewayProxyResult>;
