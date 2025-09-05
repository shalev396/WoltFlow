import {
  type APIGatewayProxyEventQueryStringParameters,
  type Callback,
  type APIGatewayProxyResult,
  type Context,
} from "aws-lambda";
export type CustomAPIGatewayProxyHandler = (
  event: ICustomAPIGatewayProxyEventAuth,
  context: Context,
  callback: Callback
) => Promise<APIGatewayProxyResult>;
import { type APIGatewayProxyEventV2 } from "aws-lambda";

export interface Pagination extends APIGatewayProxyEventQueryStringParameters {
  page?: string;
  limit?: string;
  startDate?: string;
  endDate?: string;
}

export interface DashboardFilter
  extends APIGatewayProxyEventQueryStringParameters {
  timeRange?: string;
}

export interface RunFilter extends Pagination {
  status?: string;
  stage?: string;
  automationMode?: string;
}

export interface ICustomAPIGatewayProxyEventAuth
  extends APIGatewayProxyEventV2 {
  headers: {
    cookie?: string;
    "x-api-key"?: string;
    "X-API-Key"?: string;
  };
  userId?: string;
}

export interface ICustomAPIGatewayProxyEventPaginate
  extends ICustomAPIGatewayProxyEventAuth {
  // Now compatible (still has the index signature)
  queryStringParameters?: Pagination;
}

export interface ICustomAPIGatewayProxyEventDashboard
  extends ICustomAPIGatewayProxyEventAuth {
  // Now compatible (still has the index signature)
  queryStringParameters?: DashboardFilter;
}

export interface ICustomAPIGatewayProxyEventPaginateForRun
  extends ICustomAPIGatewayProxyEventAuth {
  queryStringParameters?: RunFilter;
}

export interface ICustomAPIGatewayProxyEventStepFunction
  extends APIGatewayProxyEventV2 {
  // Step Functions properties
  queryStringParameters: {
    runId?: string;
    LEVEL?: string;
  };
  runId?: string;
  Payload?: {
    runId?: string;
  };
}
export interface ICustomStepFunctionResult {
  runId: string;
  userId: string;
  success: boolean;
  completed: boolean;
  message: string;
  automationMode?: string;
  codeValue?: string;
}
