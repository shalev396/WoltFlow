import { By, Builder } from "selenium-webdriver";
import dotenv from "dotenv";
import { Run, Code } from "../../classes/index.js";
import {
  type ICustomStepFunctionResult,
  type ICustomAPIGatewayProxyEventStepFunction,
} from "../../types/index.js";

import {
  safeClick,
  waitForElement,
  setupWoltCookies,
  applyBrowserTimezone,
} from "../../utils/automation.js";
import { sleep } from "../../utils/general.js";
import { uploadImageToS3AndSaveToDb } from "../../utils/s3Util.js";
import {
  notifyOnError,
  notifyOnSuccess,
} from "../../utils/notificationUtil.js";
import {
  Options as ChromeOptions,
  ServiceBuilder as ChromeServiceBuilder,
} from "selenium-webdriver/chrome.js";

import { initDB } from "../../config/bootstrap.js";
import { ChromiumWebDriver } from "selenium-webdriver/chromium.js";

dotenv.config();
await initDB();
export const handler = async (
  event: ICustomAPIGatewayProxyEventStepFunction,
): Promise<ICustomStepFunctionResult> => {
  let success = false;
  let userId: string | undefined;

  const extractedRunId = event.runId || event.queryStringParameters?.runId;

  if (!extractedRunId) {
    throw new Error("Missing runId");
  }
  const runId = extractedRunId;

  console.log("Start chrome + driver");
  const options = new ChromeOptions();
  const service = new ChromeServiceBuilder("/opt/chromedriver");

  options.setChromeBinaryPath("/opt/chrome/chrome");

  options.addArguments("--headless=old");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--disable-gpu");
  options.addArguments("--single-process"); //with isWorking="true", ms="163767"||without(//) isWorking="true", ms="168950"
  options.addArguments("--no-zygote");
  options.addArguments("--remote-debugging-port=0");

  options.addArguments("--window-size=1920,1080");
  options.addArguments("--force-device-scale-factor=1");

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

  console.log("Applying browser timezone override...");
  await applyBrowserTimezone(driver as ChromiumWebDriver, "Asia/Jerusalem");

  console.log("End chrome + driver");
  try {
    const runData = await Run.findWithWoltSettings(runId);
    if (!runData) {
      throw new Error("Run not found");
    }
    userId = runData.userId;

    await Run.updateStage(runId, "applying_gift");

    if (!runData.hasWoltSettings) {
      await Run.markFailed(runId);
      throw new Error("Settings not found");
    }

    const code = await Code.findLatestUnused(userId);

    if (!code) {
      await Run.markFailed(runId);
      throw new Error("No unused gift card code found");
    }

    await setupWoltCookies(
      driver,
      runData.woltRefreshToken || "",
      runData.woltAccessToken || "",
    );

    console.log("Navigating to Wolt code redemption page");
    await driver.get("https://wolt.com/he/me/redeem-code");
    await sleep(3000);

    console.log("Entering gift card code in redemption form");
    const codeInput = await waitForElement(
      driver,
      By.xpath("//input[@data-test-id='redeem-code-input']"),
      10000,
    );

    if (codeInput) {
      await codeInput.clear();
      await codeInput.sendKeys(code.code);
      await sleep(1000);
    } else {
      throw new Error("Could not find code input field");
    }

    console.log("Submitting gift card code for redemption");
    const applyCodeButton = await waitForElement(
      driver,
      By.xpath("//button[normalize-space(.)='למימוש הקוד']"),
      10000,
    );

    if (applyCodeButton) {
      await safeClick(driver, applyCodeButton);
      await sleep(3000);
    } else {
      throw new Error("Could not find apply code button");
    }

    console.log("Checking for successful gift card redemption");
    await sleep(2000);

    await Code.markAsUsed(code.id);
    success = true;
    console.log("Gift card code redeemed successfully");

    if (driver) {
      try {
        const screenshotBase64 = await driver.takeScreenshot();
        const base64WithPrefix = `data:image/png;base64,${screenshotBase64}`;
        const currentUrl = await driver.getCurrentUrl();
        await uploadImageToS3AndSaveToDb(
          base64WithPrefix,
          runId,
          false,
          currentUrl,
          "success",
          "applying_gift",
        );
        console.log("Success screenshot uploaded to S3 and saved to database");
      } catch (screenshotError) {
        console.error("Failed to upload success screenshot:", screenshotError);
      }
    }
  } catch (err) {
    console.error("Error redeeming gift card:", err);
    success = false;

    if (driver && runId) {
      try {
        const screenshotBase64 = await driver.takeScreenshot();
        const base64WithPrefix = `data:image/png;base64,${screenshotBase64}`;
        const currentUrl = await driver.getCurrentUrl();
        await uploadImageToS3AndSaveToDb(
          base64WithPrefix,
          runId,
          true,
          currentUrl,
          "error",
          "applying_gift",
        );
        console.log("Error screenshot uploaded to S3 and saved to database");
      } catch (screenshotError) {
        console.error("Failed to upload error screenshot:", screenshotError);
      }
    }
  } finally {
    if (driver) {
      console.log("Current URL:", await driver.getCurrentUrl());
      console.log("Gift card redemption success:", success);
      await sleep(1000);
      await driver.quit();
      console.log("driver quit");
    }
  }

  if (runId) {
    if (success) {
      await Run.markCompleted(runId);

      try {
        if (userId) {
          await notifyOnSuccess(
            userId,
            runId,
            "Gift card redemption completed successfully",
          );
        }
      } catch (notificationError) {
        console.error(
          "Failed to send success notification:",
          notificationError,
        );
      }
    } else {
      await Run.markFailed(runId);

      try {
        if (userId) {
          await notifyOnError(userId, runId, "Gift card redemption failed");
        }
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }
    }
  }

  if (success) {
    return {
      runId: runId,
      userId: userId || "",
      success: true,
      completed: true,
      message: "Gift card redemption completed",
    };
  } else {
    throw new Error("Gift card redemption failed");
  }
};
