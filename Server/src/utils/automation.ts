import path from "path";
import fs from "fs";
import os from "os";
import {
  By,
  type IWebDriverOptionsCookie,
  until,
  WebDriver,
  WebElement,
} from "selenium-webdriver";
import type { ChromiumWebDriver } from "selenium-webdriver/chromium.js";
import { PAGE_LOAD_TIME, sleep } from "./general.js";

/**
 * Force browser timezone via CDP Emulation.setTimezoneOverride.
 * Use before any navigation. Requires a Chromium-based driver (Chrome/Edge).
 *
 * @see https://chromedevtools.github.io/devtools-protocol/tot/Emulation/#method-setTimezoneOverride
 * @see https://seleniumhq.github.io/documentation/webdriver/bidi/cdp
 */
async function forceBrowserTimezone(
  driver: ChromiumWebDriver,
  timezoneId = "Asia/Jerusalem",
): Promise<void> {
  await driver.sendDevToolsCommand("Emulation.setTimezoneOverride", {
    timezoneId,
  });
}

/**
 * Log browser timezone and current time for verification.
 */
async function logBrowserTime(driver: ChromiumWebDriver): Promise<void> {
  const tz = await driver.executeScript(
    "return Intl.DateTimeFormat().resolvedOptions().timeZone",
  );
  const now = await driver.executeScript("return new Date().toString()");
  console.log("Browser TZ:", tz);
  console.log("Browser now:", now);
}

/**
 * Apply timezone override, log verification, and fail fast if wrong.
 * Call immediately after driver build, before any navigation.
 * Requires a Chromium-based driver (Chrome/Edge).
 */
export async function applyBrowserTimezone(
  driver: ChromiumWebDriver,
  timezoneId = "Asia/Jerusalem",
): Promise<void> {
  await forceBrowserTimezone(driver, timezoneId);
  await logBrowserTime(driver);
  const tz = await driver.executeScript(
    "return Intl.DateTimeFormat().resolvedOptions().timeZone",
  );
  if (tz !== timezoneId) {
    throw new Error(`Timezone override failed. Browser TZ is ${tz}`);
  }
}

export async function setupWoltCookies(
  driver: WebDriver,
  wrToken: string,
  wToken: string,
): Promise<void> {
  try {
    // Cookies Setup
    await driver.get("https://wolt.com/he/discovery");

    const expirationDate = Date.now() / 1000 + 1800; // Default 30 min
    // Build cookies for browser
    const cookiesToSet = [];

    if (wrToken) {
      cookiesToSet.push({
        domain: "wolt.com",
        expirationDate: expirationDate,
        hostOnly: true,
        httpOnly: false,
        name: "__wrtoken",
        path: "/",
        sameSite: "unspecified",
        secure: true,
        session: false,
        storeId: "0",
        value: encodeURIComponent(`"${wrToken}"`),
      });
    }

    if (wToken) {
      // wToken is already a JSON string from the database, so we use it directly
      cookiesToSet.push({
        domain: "wolt.com",
        expirationDate: expirationDate,
        hostOnly: true,
        httpOnly: false,
        name: "__wtoken",
        path: "/",
        sameSite: "unspecified",
        secure: true,
        session: false,
        storeId: "0",
        value: encodeURIComponent(wToken),
      });
    }

    await driver.manage().deleteAllCookies();
    await driver.get("https://wolt.com");

    // Set cookies
    for (const cookie of cookiesToSet) {
      try {
        await driver.manage().addCookie(sanitize(cookie));
      } catch (e) {
        console.log("error setting cookie", e, "cookie", cookie);
      }
    }
    await driver.get("https://wolt.com");
    await sleep(PAGE_LOAD_TIME);
  } catch (error) {
    console.error("Error setting up Wolt cookies:", error);
    throw error;
  }
}

export function safeClick(
  driver: WebDriver,
  element: WebElement,
  timeout = 3000,
  retries = 3,
) {
  // wait until clickable, then click with retries and JS fallback for overlays
  return (async () => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        await driver.wait(until.elementIsVisible(element), timeout);
        await driver.wait(until.elementIsEnabled(element), timeout);
        await element.click();
        return;
      } catch (err: unknown) {
        // If the element is not clickable due to an overlay/backdrop, fall back to JS click
        const error = err as Error & { name?: string; message?: string };
        const intercepted =
          error?.name === "ElementClickInterceptedError" ||
          /intercepted/i.test(error?.message || "");

        console.log("intercepted err.name=", error.name);
        if (intercepted) {
          try {
            await driver.executeScript("arguments[0].click();", element);
            return;
          } catch {
            // Continue to retry below
          }
        }

        // If this was the last retry, rethrow
        if (attempt === retries - 1) {
          console.log("safeClick failed after retries", err);
          throw err;
        }

        // Small back-off before retrying
        await sleep(500);
      }
    }
  })();
}

/**
 * Waits up to `timeoutMs` for the locator to match an element,
 * then returns that WebElement, or `null` if not found in time.
 *
 * @param driver    your Selenium WebDriver instance
 * @param locator   a By locator (e.g. By.xpath(...) or By.css(...))
 * @param timeoutMs max milliseconds to wait (default: 1s)
 */
export async function waitForElement(
  driver: WebDriver,
  locator: By,
  timeoutMs = 3000,
): Promise<WebElement | null> {
  try {
    console.log("waiting for element", timeoutMs, "ms");
    const element = await driver.wait(until.elementLocated(locator), timeoutMs);
    // Ensure element is visible before returning
    await driver.wait(until.elementIsVisible(element), timeoutMs);
    return element;
  } catch (err) {
    console.log(`Element not found within ${timeoutMs}ms: ${locator}`);

    // Only save screenshot to filesystem in development mode.
    // Use os.tmpdir() so Lambda can write (process.cwd() is read-only there).
    if (process.env.ENV === "dev") {
      const base64 = await driver.takeScreenshot();
      const dir = path.join(os.tmpdir(), "screenshots");
      fs.mkdirSync(dir, { recursive: true });
      const filename = path.join(dir, `timeout_${Date.now()}.png`);
      fs.writeFileSync(filename, base64, "base64");
      console.log(`Saved timeout screenshot: ${filename}`);
    }

    // Best-effort selectors: return null instead of throwing so optional
    // steps in the C handler can `if (el) ...` past missing elements.
    const locStr = locator.toString();
    if (
      locStr.includes("data-test-id='modal-close-button'") ||
      locStr.includes("data-localization-key='user.redeem'")
    ) {
      return null;
    }
    console.log("locator", locStr);
    throw err;
  }
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  decoded_exp?: number;
}

export async function refreshTokens(
  refreshToken: string,
): Promise<TokenResponse> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("refresh_token", refreshToken);

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://authentication.wolt.com/v1/wauth2/access_token",
      requestOptions,
    );
    const result = await response.text();
    console.log("result", result);
    const tokenResponse = JSON.parse(result) as TokenResponse;

    // Decode JWT to get expiration
    try {
      const [, payload] = tokenResponse.access_token.split(".");
      const decodedPayload = JSON.parse(atob(payload!));
      tokenResponse.decoded_exp = decodedPayload.exp;
    } catch (decodeError) {
      console.error("Failed to decode JWT:", decodeError);
    }
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    return tokenResponse;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
}

export const sanitize = (cookie: IWebDriverOptionsCookie) => {
  const c = { ...cookie };
  if (!["Lax", "Strict", "None"].includes(c.sameSite || "")) {
    c.sameSite = "None";
  }
  if (c.sameSite === "None") {
    c.secure = true;
  }
  return c;
};
