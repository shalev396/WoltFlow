import path from "path";
import fs from "fs";
import { By, until, WebDriver, WebElement } from "selenium-webdriver";
import { PAGE_LOAD_TIME, sleep } from "./general";

export function getGiftCardUrl(amount: number): string | null {
  const giftCards: Array<{ amount: number; url: string }> = [
    {
      amount: 20,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e452869307ba76c96cb9c2d",
    },
    {
      amount: 25,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e453b79e69e3e55f1bed164",
    },
    {
      amount: 30,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e453bac2821fce42844771f",
    },
    {
      amount: 35,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e2ea8c56e2b3eeaebb62d78",
    },
    {
      amount: 40,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e3a79083b902ad7f1e21024",
    },
    {
      amount: 45,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e3a7914b0a451dbcea70d3d",
    },
    {
      amount: 50,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c6152da1f868c000a863b24",
    },
    {
      amount: 60,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e4665a03f009985cd78bcd3",
    },
    {
      amount: 70,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5e4665d5f83475eca775e41b",
    },
    {
      amount: 75,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-638f360e9ca2c8c8d494338d",
    },
    {
      amount: 80,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5eeb68a6beaee194b2e75ef1",
    },
    {
      amount: 85,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-62303a7c07b27ce9ed8dc8c1",
    },
    {
      amount: 90,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5d3598ef57e8026517eab7ef",
    },
    {
      amount: 100,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c615514a4181a000b3b080e",
    },
    {
      amount: 150,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c6156adf315f7000a3a1bd5",
    },
    {
      amount: 200,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c61553b5d20280009b3d0dd",
    },
    {
      amount: 250,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c6156b7b20a02000ade6e8e",
    },
    {
      amount: 300,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c615741b79e43000a26f109",
    },
    {
      amount: 350,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c61574c3443ed000b2de8ce",
    },
    {
      amount: 400,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5dcd469847be047afe4e1795",
    },
    {
      amount: 450,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5fe991c5c520c9604266f025",
    },
    {
      amount: 500,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c6157acf315f7000b911da8",
    },
    {
      amount: 550,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5fe993c1e2a4535687a62352",
    },
    {
      amount: 600,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-60dc81f3599df161e8d62ca6",
    },
    {
      amount: 650,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-63d799214cc5e23606bb020f",
    },
    {
      amount: 700,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-63d79a3f4cc5e23606bb0368",
    },
    {
      amount: 800,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-6527b54def5310f71ba718cc",
    },
    {
      amount: 850,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-6527b560c0006ae00aa9806e",
    },
    {
      amount: 900,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5c7b94db63ff6e000ba917f5",
    },
    {
      amount: 1000,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5d3573e50095f06b17041caf",
    },
    {
      amount: 1500,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-5d359dacea185a7c9403cb82",
    },
    {
      amount: 180,
      url: "https://wolt.com/he/isr/tel-aviv/venue/woltilgiftcards/itemid-67c6e23a20601878d237742c",
    },
  ];

  const card = giftCards.find((c) => c.amount === amount);
  return card ? card.url : null;
}

export async function setupWoltCookies(
  driver: WebDriver,
  wrToken: string,
  wToken: string
): Promise<void> {
  try {
    // Cookies Setup
    await driver.get("https://wolt.com/he/discovery");

    let expirationDate = Date.now() / 1000 + 1800; // Default 30 min
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
      const accessTokenObject = {
        accessToken: wToken,
        expirationTime: expirationDate,
      };
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
        value: encodeURIComponent(JSON.stringify(accessTokenObject)),
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
  timeout = 3000
) {
  // wait until clickable, then click
  return driver
    .wait(until.elementIsVisible(element), timeout)
    .then(() => driver.wait(until.elementIsEnabled(element), timeout))
    .then(() => element.click())
    .catch((err) => {
      console.log("error", err);
      throw err;
      // return null;
    });
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
  timeoutMs = 3000
): Promise<WebElement | null> {
  try {
    console.log("waiting for element", timeoutMs, "ms");
    const element = await driver.wait(until.elementLocated(locator), timeoutMs);
    return element;
  } catch (err: any) {
    console.log(`Element not found within ${timeoutMs}ms: ${locator}`);

    // Only save screenshot to filesystem in development mode
    if (process.env["ENV"] === "Development") {
      const base64 = await driver.takeScreenshot();
      const dir = path.resolve(process.cwd(), "screenshots");
      fs.mkdirSync(dir, { recursive: true });
      const filename = path.join(dir, `timeout_${Date.now()}.png`);
      fs.writeFileSync(filename, base64, "base64");
      console.log(`Saved timeout screenshot: ${filename}`);
    }

    if (
      locator.toString() ===
        "By(xpath, //*[normalize-space(text())='אשמח להמשיך'])" ||
      locator.toString() === "By(xpath, //button[@aria-label='מחיקה'])" ||
      locator.toString() ===
        `//button[@data-test-id="PaymentMethodsList.PaymentMethod"and @data-payment-method-id="cibus"]`
    ) {
      return null;
    }
    console.log("locator", locator.toString());
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
  refreshToken: string
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
      requestOptions
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

export const sanitize = (cookie: any) => {
  const c = { ...cookie };
  if (!["Lax", "Strict", "None"].includes(c.sameSite)) {
    c.sameSite = "None";
  }
  if (c.sameSite === "None") {
    c.secure = true;
  }
  return c;
};
