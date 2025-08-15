import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
import { createSuccessResponse } from "../../utils/responseUtil.js";
export const handler: CustomAPIGatewayProxyHandler = async (
  _event,
  _context
) => {
  return createSuccessResponse("Server is running", {
    ENV: process.env["ENV"],
  });
};
