// import {
//   APIGatewayProxyEventV2,
//   APIGatewayProxyResult,
//   Context,
// } from "aws-lambda";
// import sequelize from "../config/database.js";
// import { syncDatabase } from "../config/bootstrap.js";

// // Connect to database
// await sequelize.authenticate();
// await syncDatabase();

export const handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
};
