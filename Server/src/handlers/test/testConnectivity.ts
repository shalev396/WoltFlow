import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyResult,
} from "aws-lambda";

/**
 * Test Lambda function to debug VPC connectivity issues
 * Tests: Internet access, DNS resolution, database connection
 */
export const handler = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Starting connectivity test...");

  const results = {
    timestamp: new Date().toISOString(),
    tests: {} as Record<string, any>,
  };

  // Test 1: Environment Variables
  console.log("Test 1: Environment Variables");
  results.tests["environment"] = {
    AWS_REGION: process.env["AWS_REGION"],
    ENV: process.env["ENV"],
    DB_PORT: process.env["DB_PORT"],
    hasVpcConfig: !!process.env["LAMBDA_SUBNET_ID_A_DEV"],
  };

  // Test 2: DNS Resolution
  console.log("Test 2: DNS Resolution");
  try {
    const dns = await import("dns").then((m) => m.promises);
    const googleDns = await dns.lookup("google.com");
    results.tests["dns"] = {
      status: "success",
      google: googleDns,
      message: "DNS resolution working",
    };
    console.log("DNS test passed:", googleDns);
  } catch (error: any) {
    results.tests["dns"] = {
      status: "failed",
      error: error.message,
      message: "Cannot resolve DNS - likely no internet access",
    };
    console.error("DNS test failed:", error.message);
  }

  // Test 3: Internet HTTP Request
  console.log("Test 3: Internet HTTP Request");
  try {
    const https = await import("https");
    const response = await new Promise((resolve, reject) => {
      const req = https.get(
        "https://httpbin.org/ip",
        { timeout: 5000 },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve(JSON.parse(data)));
        }
      );
      req.on("error", reject);
      req.on("timeout", () => reject(new Error("HTTP request timeout")));
    });

    results.tests["http"] = {
      status: "success",
      response,
      message: "Internet access working",
    };
    console.log("HTTP test passed:", response);
  } catch (error: any) {
    results.tests["http"] = {
      status: "failed",
      error: error.message,
      message: "Cannot reach internet - check route table",
    };
    console.error("HTTP test failed:", error.message);
  }

  // Test 4: Database Connection (basic)
  console.log("Test 4: Database Connection");
  try {
    // Try to import sequelize and test connection
    const sequelize = await import("../../config/database.js").then(
      (m) => m.default
    );
    await sequelize.authenticate();

    results.tests["database"] = {
      status: "success",
      message: "Database connection successful",
    };
    console.log("Database test passed");
  } catch (error: any) {
    results.tests["database"] = {
      status: "failed",
      error: error.message,
      message: "Database connection failed - check security groups",
    };
    console.error("Database test failed:", error.message);
  }

  // Summary
  const failedTests = Object.values(results.tests).filter(
    (test: any) => test.status === "failed"
  );
  const allPassed = failedTests.length === 0;

  console.log(
    `Connectivity test completed. ${failedTests.length} failed tests.`
  );

  return {
    statusCode: allPassed ? 200 : 500,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(
      {
        success: allPassed,
        message: allPassed
          ? "All connectivity tests passed!"
          : `${failedTests.length} tests failed`,
        results,
        troubleshooting: {
          dns_failed:
            "Check if subnets have route to Internet Gateway (0.0.0.0/0 → igw-xxx)",
          http_failed:
            "Check route table configuration - Lambda needs internet access",
          database_failed:
            "Check security group rules between Lambda SG and RDS SG",
        },
      },
      null,
      2
    ),
  };
};
