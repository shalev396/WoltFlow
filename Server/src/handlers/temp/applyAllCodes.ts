import { By, Builder } from "selenium-webdriver";

import sequelize from "../../config/database.js";
import Setting from "../../models/Setting.js";
import Code from "../../models/Code.js";
import Run from "../../models/Run.js";
import { ICustomAPIGatewayProxyEventStepFunction } from "../../typescript/interfaces/aws.js";
import { APIGatewayProxyResult } from "aws-lambda";
import {
  safeClick,
  waitForElement,
  setupWoltCookies,
} from "../../utils/automation.js";
import { sleep } from "../../utils/general.js";
import { uploadImageToS3AndSaveToDb } from "../../utils/s3Util.js";
import {
  Options as ChromeOptions,
  ServiceBuilder as ChromeServiceBuilder,
} from "selenium-webdriver/chrome.js";
import dotenv from "dotenv";
import { syncDatabase } from "../../config/bootstrap.js";

// Environment variables
dotenv.config();

// Connect to database
await sequelize.authenticate();
await syncDatabase();

interface CodeResult {
  codeId: number;
  code: string;
  success: boolean;
  error?: string;
  screenshotUrl?: string | undefined;
}

export const handler = async (
  event: ICustomAPIGatewayProxyEventStepFunction
): Promise<APIGatewayProxyResult> => {
  let driver: any = null;
  let run: Run | null = null;

  try {
    // Extract userId from event
    const userId = event.queryStringParameters?.["userId"];

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing userId parameter" }),
      };
    }

    console.log(`Starting to apply all unused codes for user: ${userId}`);

    // Create a new run for tracking this bulk operation
    run = await Run.create({
      user_id: userId,
      status: "in progress",
      stage: "applying gift",
      amount: 0,
      is_notify: false,
      mode: "full-run",
    });

    console.log(`Created run ${run.id} for bulk code application`);

    // Get user settings
    const settings = await Setting.findOne({ where: { userId } });
    if (!settings) {
      await run.update({ status: "failed" });
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Settings not found for user" }),
      };
    }

    // Get all unused codes for the user
    const unusedCodes = await Code.findAll({
      where: { userId, isUsed: false },
      order: [["createdAt", "ASC"]], // Apply oldest codes first
    });

    if (unusedCodes.length === 0) {
      await run.update({ status: "success", stage: "done" });
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "No unused codes found for user",
          results: [],
        }),
      };
    }

    console.log(`Found ${unusedCodes.length} unused codes to apply`);

    // Browser setup
    console.log("Setting up Chrome browser...");
    const options = new ChromeOptions();
    const service = new ChromeServiceBuilder("/opt/chromedriver");

    options.setChromeBinaryPath("/opt/chrome/chrome");

    // Essential Chrome flags for Lambda
    options.addArguments("--headless=old");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--disable-gpu");
    options.addArguments("--single-process");
    options.addArguments("--no-zygote");
    options.addArguments("--remote-debugging-port=0");

    // Set exact window size
    options.addArguments("--window-size=1920,1080");
    options.addArguments("--force-device-scale-factor=1");

    // Basic optimizations
    options.addArguments("--disable-extensions");
    options.addArguments("--disable-plugins");
    options.addArguments("--no-first-run");
    options.addArguments("--disable-default-apps");

    console.log("Building Chrome driver...");
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)
      .build();

    console.log("Chrome driver ready");

    // Setup Wolt cookies using the extracted function
    await setupWoltCookies(
      driver,
      settings.get("wrtoken") || "",
      settings.get("wtoken") || ""
    );

    const results: CodeResult[] = [];
    let successfulApplications = 0;

    // Process each code
    for (let i = 0; i < unusedCodes.length; i++) {
      const code = unusedCodes[i];
      if (!code) {
        console.log(`Skipping undefined code at index ${i}`);
        continue;
      }
      const codeValue = code.get("code") as string;
      const codeId = code.get("codeId") as number;

      console.log(
        `Processing code ${i + 1}/${unusedCodes.length}: ${codeValue}`
      );

      try {
        // Navigate to code redemption page
        console.log("Navigating to Wolt code redemption page");
        await driver.get("https://wolt.com/he/me/redeem-code");
        await sleep(3000);

        // Enter gift card code
        console.log(`Entering gift card code: ${codeValue}`);
        const codeInput = await waitForElement(
          driver,
          By.xpath("//input[@placeholder='קוד קופון']"),
          10000
        );

        if (codeInput) {
          await codeInput.clear();
          await codeInput.sendKeys(codeValue);
          await sleep(1000);
        } else {
          throw new Error("Could not find code input field");
        }

        // Submit code redemption
        console.log("Submitting gift card code for redemption");
        const applyCodeButton = await waitForElement(
          driver,
          By.xpath("//button[normalize-space(.)='למימוש הקוד']"),
          10000
        );

        if (applyCodeButton) {
          await safeClick(driver, applyCodeButton);
          await sleep(3000);
        } else {
          throw new Error("Could not find apply code button");
        }

        // Check for successful redemption - you might want to add specific success indicators here
        console.log("Checking for successful gift card redemption");
        await sleep(2000);

        // Take success screenshot
        let screenshotUrl: string | undefined;
        try {
          const screenshotBase64 = await driver.takeScreenshot();
          const base64WithPrefix = `data:image/png;base64,${screenshotBase64}`;
          const screenshot = await uploadImageToS3AndSaveToDb(
            base64WithPrefix,
            run.id,
            false
          );
          screenshotUrl = screenshot?.url;
          console.log("Success screenshot uploaded");
        } catch (screenshotError) {
          console.error(
            "Failed to upload success screenshot:",
            screenshotError
          );
        }

        // Mark code as used
        if (code) {
          await code.update({ isUsed: true });
        }
        successfulApplications++;

        results.push({
          codeId,
          code: codeValue,
          success: true,
          screenshotUrl,
        });

        console.log(`Successfully applied code: ${codeValue}`);
      } catch (codeError: any) {
        console.error(`Error applying code ${codeValue}:`, codeError);

        // Take error screenshot
        let screenshotUrl: string | undefined;
        try {
          const screenshotBase64 = await driver.takeScreenshot();
          const base64WithPrefix = `data:image/png;base64,${screenshotBase64}`;
          const screenshot = await uploadImageToS3AndSaveToDb(
            base64WithPrefix,
            run.id,
            true
          );
          screenshotUrl = screenshot?.url;
          console.log("Error screenshot uploaded");
        } catch (screenshotError) {
          console.error("Failed to upload error screenshot:", screenshotError);
        }

        results.push({
          codeId,
          code: codeValue,
          success: false,
          error: codeError.message,
          screenshotUrl,
        });

        // Don't mark code as used if it failed
        console.log(
          `Failed to apply code: ${codeValue} - ${codeError.message}`
        );
      }

      // Add delay between codes to avoid overwhelming the website
      if (i < unusedCodes.length - 1) {
        console.log("Waiting 2 seconds before next code...");
        await sleep(2000);
      }
    }

    // Update run status based on overall success
    const allSuccess = results.every((r) => r.success);
    const anySuccess = results.some((r) => r.success);

    if (allSuccess) {
      await run.update({ status: "success", stage: "done" });
    } else if (anySuccess) {
      await run.update({ status: "success", stage: "done" }); // Partial success still counts as success
    } else {
      await run.update({ status: "failed" });
    }

    console.log(
      `Bulk code application completed. ${successfulApplications}/${unusedCodes.length} codes applied successfully`
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Bulk code application completed",
        runId: run.id,
        totalCodes: unusedCodes.length,
        successfulApplications,
        failedApplications: unusedCodes.length - successfulApplications,
        results,
      }),
    };
  } catch (err: any) {
    console.error("applyAllCodes error:", err);

    if (run) {
      await run.update({ status: "failed" });
    }

    // Take final error screenshot
    if (driver && run) {
      try {
        const screenshotBase64 = await driver.takeScreenshot();
        const base64WithPrefix = `data:image/png;base64,${screenshotBase64}`;
        await uploadImageToS3AndSaveToDb(base64WithPrefix, run.id, true);
        console.log("Final error screenshot uploaded");
      } catch (screenshotError) {
        console.error(
          "Failed to upload final error screenshot:",
          screenshotError
        );
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: err.message || "Unknown error",
        runId: run?.id,
      }),
    };
  } finally {
    if (driver) {
      console.log("Closing browser...");
      await sleep(1000);
      await driver.quit();
      console.log("Browser closed");
    }
  }
};
