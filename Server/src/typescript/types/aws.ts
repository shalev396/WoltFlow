import { APIGatewayProxyResult, Context } from "aws-lambda";
import { ICustomAPIGatewayProxyEvent } from "../interfaces/aws.js";

export type CustomAPIGatewayProxyHandler = (
  event: ICustomAPIGatewayProxyEvent,
  context: Context,
  callback: (
    error?: Error | null | string,
    result?: APIGatewayProxyResult
  ) => void
) => Promise<APIGatewayProxyResult>;
