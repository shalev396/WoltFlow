import { By, Builder, WebElement } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { Lambda } from "aws-sdk";
import sequelize from "../../config/database";
import Setting from "../../models/Setting";
import Run from "../../models/Run";
import { CustomAPIGatewayProxyHandler } from "../../typescript/types/aws";
import {
  safeClick,
  getGiftCardUrl,
  waitForElement,
  setupWoltCookies,
} from "../../utils/automation";
import { sleep } from "../../utils/general";
import { uploadImageToS3AndSaveToDb } from "../../utils/s3Util";

const lambda = new Lambda();

export const handler: CustomAPIGatewayProxyHandler = async (event) => {
  let success = false;
  let run: Run | null = null;
  let driver: any = null;

  try {
    const runId = event.queryStringParameters?.runId;
    if (!runId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing runId" }),
      };
    }

    await sequelize.authenticate();

    // Get the run and associated user
    run = await Run.findByPk(runId);
    if (!run) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Run not found" }),
      };
    }

    const userId = run.user_id;

    // Update run stage
    await run.update({ stage: "buying gift" });

    const settings = await Setting.findOne({ where: { userId } });
    if (!settings) {
      await run.update({ status: "failed" });
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Settings not found" }),
      };
    }

    // Browser setup
    const chromeBinary =
      process.env.IS_OFFLINE === "true"
        ? "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
        : "/opt/bin/headless-chromium";

    const options = new chrome.Options()
      .setChromeBinaryPath(chromeBinary)
      .addArguments("--window-size=1920,1080", "--incognito");

    // Add headless and disable-gpu only in production (not development)
    if (process.env.ENV !== "Development") {
      options.addArguments("--headless", "--disable-gpu");
    }

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options as any)
      .build();

    // Setup Wolt cookies using the extracted function
    await setupWoltCookies(
      driver,
      settings.wrtoken || "",
      settings.wtoken || ""
    );

    // script start
    // Clear cart
    await driver.get("https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards");

    const continueDialogs = await waitForElement(
      driver,
      By.xpath("//*[normalize-space(text())='אשמח להמשיך']"),
      8000
    );

    if (continueDialogs != null) {
      const noButton = await waitForElement(
        driver,
        By.xpath("//button[normalize-space(.)='לא']")
      );
      await safeClick(driver, noButton as WebElement);

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

      const closeButtons = await waitForElement(
        driver,
        By.xpath("//button[@aria-label='סגירה']")
      );
      if (closeButtons) {
        await safeClick(driver, closeButtons);
      }
      await sleep(5000);
    }

    // Add card to cart
    const giftAmount = Number(settings.giftAmount);
    const giftUrl = getGiftCardUrl(giftAmount);
    if (!giftUrl) {
      throw new Error(`Gift card amount ${giftAmount} ILS not available`);
    }
    await driver.get(giftUrl);
    console.log("redirected to", await driver.getCurrentUrl());
    const addOrderButton = await waitForElement(
      driver,
      By.xpath("//span[normalize-space(text())='להוסיף להזמנה']"),
      8000
    );
    await safeClick(driver, addOrderButton as WebElement);
    console.log("added to cart");
    await sleep(3000);

    // Proceed to checkout
    const checkoutUrl =
      "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/checkout";
    await driver.get(checkoutUrl);
    console.log("redirected to", await driver.getCurrentUrl());
    await sleep(1000);

    const checkoutElement = await waitForElement(
      driver,
      By.xpath(
        "/html/body/div[2]/div[2]/main/div[3]/div[2]/div[1]/ul/li/a/div[2]/div[1]/span"
      ),
      8000
    );
    await safeClick(driver, checkoutElement as WebElement);

    const cibusElement = await waitForElement(
      driver,
      By.xpath("//span[normalize-space(text())='Cibus']")
    );
    await safeClick(driver, cibusElement as WebElement);

    const modalButtons = await waitForElement(
      driver,
      By.xpath("/html/body/div[4]/div[8]/div/div[2]/div/aside/div[1]/button")
    );
    if (modalButtons) {
      await safeClick(driver, modalButtons);
    }

    // Proceed to checkout
    const orderButton = await waitForElement(
      driver,
      By.xpath("//span[normalize-space(text())='לחצו להזמנה']")
    );
    await safeClick(driver, orderButton as WebElement);
    await sleep(3000);
    // Cibus iframe

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
        await usernameInput.sendKeys(settings.cibusName || "");
      }

      const passwordInput = await waitForElement(
        driver,
        By.xpath("//input[@placeholder='סיסמה']"),
        10000
      );
      if (passwordInput) {
        await passwordInput.clear();
        await passwordInput.sendKeys(settings.cibusPassword || "");
      }

      const companyInput = await waitForElement(
        driver,
        By.xpath("//input[@placeholder='חברה']"),
        10000
      );
      if (companyInput) {
        await companyInput.clear();
        await companyInput.sendKeys(settings.cibusCompany || "");
      }

      // Step 3: Complete Cibus login
      const loginButton = await waitForElement(
        driver,
        By.id("btnSubmit"),
        10000
      );
      if (loginButton) {
        await safeClick(driver, loginButton);
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

      // Return to main content
      await driver.switchTo().defaultContent();
    }

    if (
      await waitForElement(
        driver,
        By.xpath(
          "//span[@data-localization-key='order.gift-card-tracking-title']"
        ),
        6000
      )
    ) {
      success = true;
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

    // Fire-and-forget trigger getDailyCode function if purchase was successful
    if ((success || process.env.ENV === "Development") && run) {
      console.log("Gift purchase successful, triggering getDailyCode function");

      const isOffline = process.env.IS_OFFLINE === "true";

      if (isOffline) {
        // For serverless offline, make HTTP request without waiting
        console.log(
          "Running in offline mode, triggering getDailyCode (fire-and-forget)"
        );

        // Fire and forget - don't await the response
        fetch(`http://localhost:3000/api/gmail/daily-code?runId=${run.id}`, {
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
        const functionName = process.env.GET_DAILY_CODE_FUNCTION_NAME!;
        const invokeParams = {
          FunctionName: functionName,
          InvocationType: "Event" as const, // Fire and forget
          Payload: JSON.stringify({
            queryStringParameters: { runId: run.id },
          }),
        };

        // Fire and forget - don't await the response
        lambda
          .invoke(invokeParams)
          .promise()
          .catch((error) => {
            console.error(
              "Lambda invoke to getDailyCode failed (but continuing):",
              error
            );
          });

        console.log(
          "getDailyCode Lambda invocation triggered (not waiting for completion)"
        );
      }
    } else {
      console.log("Gift purchase failed, skipping getDailyCode trigger");
      if (run && !success) {
        await run.update({ status: "failed" });
      }
    }

    // Take final screenshot and return it only in development mode
    if (process.env.ENV === "Development" && driver) {
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
        message: success ? "Gift purchase completed" : "Gift purchase failed",
      }),
    };
  }
};
// //span[@data-localization-key='order.gift-card-tracking-title']
// //span[@data-localization-key='order.gift-card-tracking-subtitle']
// //span[@data-localization-key='order.gift-card-tracking-link']
