import { By, Builder, WebElement } from "selenium-webdriver";

import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import sequelize from "../../config/database.js";
import Setting from "../../models/Setting.js";
import Run from "../../models/Run.js";
import {
  safeClick,
  getGiftCardUrl,
  waitForElement,
  setupWoltCookies,
} from "../../utils/automation.js";
import { sleep } from "../../utils/general.js";
import { uploadImageToS3AndSaveToDb } from "../../utils/s3Util.js";
import {
  Options as ChromeOptions,
  ServiceBuilder as ChromeServiceBuilder,
} from "selenium-webdriver/chrome.js";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import dotenv from "dotenv";

// Environment variables
dotenv.config();

const ENV = process.env["ENV"];

// Connect to database
await sequelize.authenticate();

export const handler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  console.log("Starting woltBuyGift");
  console.log("Environment:", ENV);
  const LEVEL = event.queryStringParameters?.["LEVEL"];

  const lambdaClient = new LambdaClient({
    region: process.env["AWS_REGIONS"] || "", // configure region
  });
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

  let success = false;
  let run: Run | null = null;

  const baseURL_LOCAL = "http://localhost:3000/api";
  try {
    console.log("user setup");
    const runId = event.queryStringParameters?.["runId"];
    if (!runId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing runId" }),
      };
    }
    console.log("start db");
    console.log("end db");
    // Get the run and associated user
    console.log("start get run");
    run = await Run.findByPk(runId);
    if (!run) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Run not found" }),
      };
    }
    console.log("end get run");
    console.log("start get user id");
    const userId = run.get("user_id");
    console.log("end get user id");
    console.log("start update run");
    // Update run stage
    await run.update({ stage: "buying gift" });
    console.log("end update run");
    console.log("start get settings");
    const settings = await Setting.findOne({ where: { userId } });
    if (!settings) {
      await run.update({ status: "failed" });
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Settings not found" }),
      };
    }
    console.log("end get settings");
    console.log("start setup wolt cookies");
    // Setup Wolt cookies using the extracted function
    await setupWoltCookies(
      driver,
      settings.get("wrtoken") || "",
      settings.get("wtoken") || ""
    );
    console.log("end setup wolt cookies");
    console.log("start step 1");
    // script start
    const giftAmount = Number(settings.get("giftAmount"));
    const giftUrl = getGiftCardUrl(giftAmount);
    if (!giftUrl) {
      throw new Error(`Gift card amount ${giftAmount} ILS not available`);
    }

    await driver.get(giftUrl);
    console.log("end step 1");
    if (LEVEL === "1") {
      await sleep(1000);
      throw new Error("LEVEL 1");
    }
    console.log("start step 2");
    const continueDialogs = await waitForElement(
      driver,
      By.xpath("//*[normalize-space(text())='אשמח להמשיך']"),
      8000
    );

    if (continueDialogs != null) {
      console.log("start step 2.1");
      const noButton = await waitForElement(
        driver,
        By.xpath("//button[normalize-space(.)='לא']")
      );
      await safeClick(driver, noButton as WebElement);
      const closeButtons1 = await waitForElement(
        driver,
        By.xpath("//button[@aria-label='סגירה']")
      );
      if (closeButtons1) {
        await safeClick(driver, closeButtons1);
      }

      // Open the cart
      const cartButton = await waitForElement(
        driver,
        By.xpath("//button[@aria-label='ההזמנות שלך']")
      );
      await safeClick(driver, cartButton as WebElement);

      // Remove all items in the cart
      while (true) {
        const deleteButtons = await waitForElement(
          driver,
          By.xpath("//button[@aria-label='מחיקה']")
        );
        if (!deleteButtons) break;
        await safeClick(driver, deleteButtons);
      }

      const closeButtons2 = await waitForElement(
        driver,
        By.xpath("//button[@aria-label='סגירה']")
      );
      if (closeButtons2) {
        await safeClick(driver, closeButtons2);
      }
      await sleep(5000);
      console.log("end step 2.1");
    }

    console.log("end step 2");
    if (LEVEL === "2") {
      await sleep(1000);
      throw new Error("LEVEL 2");
    }
    console.log("start step 3");
    await driver.get(giftUrl);
    const addOrderButton = await waitForElement(
      driver,
      By.xpath("//span[normalize-space(text())='להוסיף להזמנה']"),
      8000
    );
    await safeClick(driver, addOrderButton as WebElement);
    console.log("end step 3");
    if (LEVEL === "3") {
      await sleep(1000);
      throw new Error("LEVEL 3");
    }
    // Proceed to checkout
    console.log("start step 4");
    // const checkoutUrl =
    //   "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/checkout";
    // await driver.get(checkoutUrl);
    // using button attempt
    const cartButton = await waitForElement(
      driver,
      By.xpath(`//button[.//div[normalize-space(text())="הצגת פריטים"]]`)
    );
    await safeClick(driver, cartButton as WebElement);
    console.log("end step 4");
    if (LEVEL === "4") {
      await sleep(1000);
      throw new Error("LEVEL 4");
    }
    console.log("start step 5");
    const checkoutButton = await waitForElement(
      driver,
      By.xpath("//button[.//div[normalize-space(text())='מעבר לתשלום']]")
    );

    await safeClick(driver, checkoutButton as WebElement);
    await sleep(8000);
    console.log("end step 5");
    if (LEVEL === "5") {
      await sleep(1000);
      throw new Error("LEVEL 5");
    }
    console.log("start step 6");
    await sleep(1000);
    const checkoutElement = await waitForElement(
      driver,
      By.xpath(
        "/html/body/div[2]/div[2]/main/div[3]/div[2]/div[1]/ul/li/a/div[2]/div[1]/span"
      ),
      8000
    );
    await safeClick(driver, checkoutElement as WebElement);
    console.log("end step 6");
    if (LEVEL === "6") {
      await sleep(1000);
      throw new Error("LEVEL 6");
    }
    console.log("start step 7");
    const cibusElement = await waitForElement(
      driver,
      By.xpath(
        `//button[@data-test-id="PaymentMethodsList.PaymentMethod"and @data-payment-method-id="cibus"]`
      )
    );
    if (cibusElement != null) {
      await safeClick(driver, cibusElement as WebElement);
      await sleep(1000);
    }
    //FIX use the cibus one
    const modalButtons = await waitForElement(
      driver,
      By.xpath(
        "/html[1]/body[1]/div[4]/div[9]/div[1]/div[2]/div[1]/aside[1]/div[1]/button[1]/div[2]"
      )
    );
    if (modalButtons) {
      await safeClick(driver, modalButtons);
    }
    console.log("end step 7");
    if (LEVEL === "7") {
      await sleep(1000);
      throw new Error("LEVEL 7");
    }
    console.log("start step 8");
    // Proceed to checkout
    const orderButton = await waitForElement(
      driver,
      By.xpath("//span[normalize-space(text())='לחצו להזמנה']")
    );
    await safeClick(driver, orderButton as WebElement);
    await sleep(3000);
    console.log("end step 8");
    // Cibus iframe
    if (LEVEL === "8") {
      await sleep(5000);
      throw new Error("LEVEL 8");
    }
    console.log("start step 9");
    // Step 1: Switch to Cibus iframe
    const iframe = await waitForElement(
      driver,
      By.xpath("//iframe[@title='cibus-challenge']"),
      20000
    );
    if (iframe) {
      await driver.switchTo().frame(iframe);

      // Step 2: Enter Cibus credentials
      const usernameInput = await waitForElement(
        driver,
        By.xpath("//input[@placeholder='שם משתמש']"),
        10000
      );
      if (usernameInput) {
        await usernameInput.clear();
        await usernameInput.sendKeys(settings.get("cibusName") || "");
      }

      const passwordInput = await waitForElement(
        driver,
        By.xpath("//input[@placeholder='סיסמה']"),
        10000
      );
      if (passwordInput) {
        await passwordInput.clear();
        await passwordInput.sendKeys(settings.get("cibusPassword") || "");
      }

      const companyInput = await waitForElement(
        driver,
        By.xpath("//input[@placeholder='חברה']"),
        10000
      );
      if (companyInput) {
        await companyInput.clear();
        await companyInput.sendKeys(settings.get("cibusCompany") || "");
      }
      console.log("end step 9");
      if (LEVEL === "9") {
        await sleep(1000);
        throw new Error("LEVEL 9");
      }
      console.log("start step 10");
      // Step 3: Complete Cibus login
      const loginButton = await waitForElement(
        driver,
        By.id("btnSubmit"),
        10000
      );
      if (loginButton) {
        await safeClick(driver, loginButton);
      }
      console.log("end step 10");
      if (LEVEL === "10") {
        await sleep(1000);
        throw new Error("LEVEL 10");
      }
      console.log("start step 11");

      // handle 2FA
      const otpInput = await waitForElement(
        driver,
        By.xpath("//input[@id='txtOTP']"),
        10000
      );
      if (otpInput) {
        await sleep(10000);

        // Fetch fresh settings to get the updated 2FA code
        const freshSettings = await Setting.findOne({ where: { userId } });
        if (!freshSettings) {
          throw new Error("Could not fetch fresh settings for 2FA code");
        }

        await otpInput.clear();
        await otpInput.sendKeys(freshSettings.get("cibus2FAcode") || "");
      }
      const loginButton2 = await waitForElement(
        driver,
        By.id("btnSubmit"),
        10000
      );
      if (loginButton2) {
        await safeClick(driver, loginButton2);
      }

      // Step 4: Confirm Cibus payment
      const paymentButton = await waitForElement(
        driver,
        By.id("btnPay"),
        15000
      );
      if (paymentButton) {
        await safeClick(driver, paymentButton);
      }
      console.log("end step 11");
      if (LEVEL === "11") {
        await sleep(1000);
        throw new Error("LEVEL 11");
      }
      // Return to main content
      await driver.switchTo().defaultContent();
    }
    try {
      if (
        await waitForElement(
          driver,
          By.xpath(
            "//span[@data-localization-key='order.gift-card-tracking-title']"
          ),
          15000
        )
      ) {
        success = true;
      }
    } catch (err) {
      console.log("confirmation element not found");
      console.error("soft error", err);
      //add || true to debug script
      if (ENV === "local" || ENV === "dev") {
        success = true;
      }
    }

    //script end
  } catch (err) {
    console.error("error", err);
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
      console.log("url", await driver.getCurrentUrl());
      console.log("success", success);
    }

    // Update run status based on success
    if (run) {
      if (!success) {
        await run.update({ status: "failed" });
      }
    }

    // Check if mode is "buy-only" and set success status if purchase was successful
    if ((success || process.env["ENV"] === "Development") && run) {
      const runMode = run.get("mode");

      if (runMode === "buy-only") {
        console.log(
          "Mode is 'buy-only', marking run as successful and skipping getDailyCode"
        );
        await run.update({
          status: "success",
          // stage: "done",
        });
      } else {
        console.log(
          "Gift purchase successful, triggering getDailyCode function"
        );

        if (ENV === "local") {
          // For serverless offline, make HTTP request without waiting
          console.log(
            "Running in offline mode, triggering getDailyCode (fire-and-forget)"
          );

          // Fire and forget - don't await the response
          fetch(`${baseURL_LOCAL}/gmail/daily-code?runId=${run.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }).catch((error) => {
            console.error(
              "HTTP request to getDailyCode failed (but continuing):",
              error
            );
          });

          console.log(
            "getDailyCode HTTP request triggered (not waiting for completion)"
          );
        } else {
          // For production, use Lambda invoke with fire-and-forget
          const functionName = process.env["GET_DAILY_CODE_FUNCTION_NAME"]!;
          const invokeParams = {
            FunctionName: functionName,
            InvocationType: "Event" as const, // Fire and forget
            Payload: JSON.stringify({
              queryStringParameters: { runId: run.id },
            }),
          };

          // Fire and forget - don't await the response
          // Synchronous invoke to ensure we see the result
          const command = new InvokeCommand(invokeParams);
          const result = await lambdaClient.send(command);

          console.log(
            `getDailyCode Lambda invocation triggered (not waiting for completion)Status: ${result?.StatusCode}`
          );
        }
      }
    } else {
      console.log("Gift purchase failed, skipping getDailyCode trigger");
      if (run && !success) {
        await run.update({ status: "failed" });
      }
    }

    // Take final screenshot and return it only in development mode
    if (process.env["ENV"] === "Development" && driver) {
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
    // await driver?.quit();
    // await sleep(2000);
    return {
      statusCode: success ? 200 : 500,
      body: JSON.stringify({
        success,
        message: success ? "Gift purchase completed" : "Gift purchase failed",
      }),
    };
  }
};
// //span[@data-localization-key='order.gift-card-tracking-title']
// //span[@data-localization-key='order.gift-card-tracking-subtitle']
// //span[@data-localization-key='order.gift-card-tracking-link']
