import { type CustomAPIGatewayProxyHandler } from "../../types/aws.js";
import { initDB, syncDatabase } from "../../config/bootstrap.js";
import { createSuccessResponse } from "../../utils/responseUtil.js";

await initDB(); 
await syncDatabase();
export const handler: CustomAPIGatewayProxyHandler = async () => {
  return createSuccessResponse("Server is running", {
    ENV: process.env.ENV,
  });
};
