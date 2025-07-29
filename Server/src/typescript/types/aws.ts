import { APIGatewayProxyResult, Context } from "aws-lambda";
import { ICustomAPIGatewayProxyEventAuth } from "../interfaces/aws.js";

export type CustomAPIGatewayProxyHandler = (
  event: ICustomAPIGatewayProxyEventAuth,
  context: Context,
  callback: (
    error?: Error | null | string,
    result?: APIGatewayProxyResult
  ) => void
) => Promise<APIGatewayProxyResult>;
