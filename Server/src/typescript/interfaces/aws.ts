import { APIGatewayProxyEventV2 } from "aws-lambda";

export interface ICustomAPIGatewayProxyEventAuth
  extends APIGatewayProxyEventV2 {
  userId?: string;
}
export interface ICustomAPIGatewayProxyEventStepFunction
  extends APIGatewayProxyEventV2 {
  // Step Functions properties
  runId?: string;
  Payload?: {
    runId?: string;
  };
}
