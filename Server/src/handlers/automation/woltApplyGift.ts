import { By, Builder } from "selenium-webdriver";

import sequelize from "../../config/database.js";
import Setting from "../../models/Setting.js";
import Code from "../../models/Code.js";
import Run from "../../models/Run.js";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws.js";
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

// Connect to database
await sequelize.authenticate();

export const handler: CustomAPIGatewayProxyHandler = async (event) => {
  let success = false;
  let run: Run | null = null;
  let driver: any = null;
  const isDev = process.env["ENV"] === "Development";
  try {
    const runId = event.queryStringParameters?.["runId"];
    if (!runId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing runId" }),
      };
    }

    // Get the run and associated user
    run = await Run.findByPk(runId);
    if (!run) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Run not found" }),
      };
    }

    const userId = run.get("user_id");

    // Update run stage
    await run.update({ stage: "applying gift" });

    // Get user settings
    const settings = await Setting.findOne({ where: { userId } });
    if (!settings) {
      await run.update({ status: "failed" });
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Settings not found" }),
      };
    }

    // Get the most recent unused code for the user
    const code = await Code.findOne({
      where: { userId, isUsed: false },
      order: [["createdAt", "DESC"]],
    });

    if (!code) {
      await run.update({ status: "failed" });
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No unused gift card code found" }),
      };
    }

    // Browser setup
    console.log("Start chrome + driver");
    const options = new ChromeOptions();
    const service = new ChromeServiceBuilder("/opt/chromedriver");

    options.setChromeBinaryPath("/opt/chrome/chrome");

    // Essential Chrome flags for Lambda
    options.addArguments("--headless=old");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--disable-gpu");
    options.addArguments("--single-process"); //with isWorking="true", ms="163767"||without(//) isWorking="true", ms="168950"
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
    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)
      .build();

    console.log("End chrome + driver");

    // Setup Wolt cookies using the extracted function
    await setupWoltCookies(
      driver,
      settings.get("wrtoken") || "",
      settings.get("wtoken") || ""
    );

    // Navigate to code redemption page
    console.log("Navigating to Wolt code redemption page");
    await driver.get("https://wolt.com/he/me/redeem-code");
    await sleep(3000);

    // Enter gift card code
    console.log("Entering gift card code in redemption form");
    const codeInput = await waitForElement(
      driver,
      By.xpath("//input[@placeholder='קוד קופון']"),
      10000
    );

    if (codeInput) {
      await codeInput.clear();
      await codeInput.sendKeys(code.get("code"));
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

    // Check for successful redemption indicators
    // You might want to add specific success indicators here
    console.log("Checking for successful gift card redemption");
    await sleep(2000);

    // Mark code as used
    await code.update({ isUsed: true });
    success = true;
    console.log("Gift card code redeemed successfully");

    // Take success screenshot and upload to S3
    if (driver && run) {
      try {
        const screenshotBase64 = await driver.takeScreenshot();
        const base64WithPrefix = `data:image/png;base64,${screenshotBase64}`;
        await uploadImageToS3AndSaveToDb(base64WithPrefix, run.id, false);
        console.log("Success screenshot uploaded to S3 and saved to database");
      } catch (screenshotError) {
        console.error("Failed to upload success screenshot:", screenshotError);
      }
    }
  } catch (err) {
    console.error("Error redeeming gift card:", err);
    success = false;

    // Take error screenshot and upload to S3
    if (driver && run) {
      try {
        const screenshotBase64 = await driver.takeScreenshot();
        const base64WithPrefix = `data:image/png;base64,${screenshotBase64}`;
        await uploadImageToS3AndSaveToDb(base64WithPrefix, run.id, true);
        console.log("Error screenshot uploaded to S3 and saved to database");
      } catch (screenshotError) {
        console.error("Failed to upload error screenshot:", screenshotError);
      }
    }
  } finally {
    if (driver) {
      console.log("Current URL:", await driver.getCurrentUrl());
      console.log("Gift card redemption success:", success);
    }

    // Update run status and stage based on success
    if (run) {
      if (success) {
        await run.update({ status: "success", stage: "done" });
      } else {
        await run.update({ status: "failed" });
      }
    }

    // Take final screenshot and return it only in development mode
    if (isDev && driver) {
      try {
        const screenshotBase64 = await driver.takeScreenshot();
        return {
          statusCode: 200,
          headers: { "Content-Type": "image/png" },
          body: screenshotBase64,
          isBase64Encoded: true,
        };
      } catch (screenshotError) {
        console.error("Failed to take final screenshot:", screenshotError);
      }
    }
    if (driver) {
      await sleep(1000);
      await driver.quit();
      console.log("driver quit");
    }
    // await sleep(2000);
    return {
      statusCode: success ? 200 : 500,
      body: JSON.stringify({
        success,
        message: success
          ? "Gift card redemption completed"
          : "Gift card redemption failed",
      }),
    };
  }
};
