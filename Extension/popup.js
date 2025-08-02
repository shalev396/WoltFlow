// Extension popup JavaScript
class WoltFlowTokenReviewer {
  constructor() {
    // Hardcoded cookie names - update these as needed
    this.accessTokenName = "__wtoken";
    this.refreshTokenName = "__wrtoken";
    this.init();
  }

  async init() {
    // Add event listeners
    this.addEventListeners();

    // Auto-fetch tokens on popup open
    this.fetchTokens();
  }

  addEventListeners() {
    document
      .getElementById("copyAccess")
      .addEventListener("click", () => this.copyToken("access"));
    document
      .getElementById("copyRefresh")
      .addEventListener("click", () => this.copyToken("refresh"));
  }

  async fetchTokens() {
    this.showLoading(true);

    try {
      const results = await Promise.all([
        this.getCookie(this.accessTokenName, "access token"),
        this.getCookie(this.refreshTokenName, "refresh token"),
      ]);

      this.displayToken("access", results[0]);
      this.displayToken("refresh", results[1]);

      const foundTokens = results.filter((r) => r.found).length;
      if (foundTokens === 0) {
        this.showStatus(
          "No tokens found. Please check that you are logged in to wolt.com.",
          "warning"
        );
      }
    } catch (error) {
      this.showStatus("Error fetching tokens: " + error.message, "error");
      console.error("Fetch tokens error:", error);
    } finally {
      this.showLoading(false);
    }
  }

  async getCookie(cookieName, tokenType) {
    if (!cookieName) {
      return { found: false, value: `${tokenType} cookie name not configured` };
    }

    try {
      // Try different possible domains for Wolt
      const domains = [
        ".wolt.com",
        "wolt.com",
        "consumer-api.wolt.com",
        "restaurant-api.wolt.com",
      ];

      for (const domain of domains) {
        const cookies = await chrome.cookies.getAll({
          domain: domain,
          name: cookieName,
        });

        if (cookies && cookies.length > 0) {
          const cookie = cookies[0];
          return {
            found: true,
            value: cookie.value,
            domain: cookie.domain,
            secure: cookie.secure,
            httpOnly: cookie.httpOnly,
            sameSite: cookie.sameSite,
          };
        }
      }

      return { found: false, value: `${tokenType} not found in cookies` };
    } catch (error) {
      console.error(`Error getting ${tokenType}:`, error);

      if (error.message.includes("host permissions")) {
        return {
          found: false,
          value: `Permission denied. Please visit wolt.com first and grant permissions.`,
        };
      }

      return { found: false, value: `Error: ${error.message}` };
    }
  }

  displayToken(type, result) {
    const element = document.getElementById(
      type === "access" ? "accessToken" : "refreshToken"
    );
    const copyBtn = document.getElementById(
      type === "access" ? "copyAccess" : "copyRefresh"
    );
    const container = copyBtn.parentElement;

    if (result.found) {
      element.textContent = result.value;
      element.className = "token-value found";
      copyBtn.style.display = "block";
      copyBtn.classList.remove("hidden");

      if (result.domain) {
        element.title = `Domain: ${result.domain}`;
      }
    } else {
      element.textContent = result.value;
      element.className = "token-value not-found";
      copyBtn.style.display = "none";
      copyBtn.classList.add("hidden");
    }
  }

  async copyToken(type) {
    const element = document.getElementById(
      type === "access" ? "accessToken" : "refreshToken"
    );
    const copyBtn = document.getElementById(
      type === "access" ? "copyAccess" : "copyRefresh"
    );
    const text = element.textContent;

    try {
      await navigator.clipboard.writeText(text);

      // Show green state for 2 seconds
      copyBtn.classList.add("copied");
      copyBtn.textContent = "✓ Copied";

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.textContent = "Copy";
      }, 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      // Show green state for 2 seconds
      copyBtn.classList.add("copied");
      copyBtn.textContent = "✓ Copied";

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.textContent = "Copy";
      }, 2000);
    }
  }

  showLoading(show) {
    const loading = document.getElementById("loading");
    const tokenInfo = document.getElementById("tokenInfo");

    if (show) {
      loading.classList.remove("hidden");
      tokenInfo.style.opacity = "0.5";
    } else {
      loading.classList.add("hidden");
      tokenInfo.style.opacity = "1";
    }
  }

  showStatus(message, type = "info") {
    const statusEl = document.getElementById("status");
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;

    // Auto-hide success messages faster for copy operations
    if (type === "success") {
      setTimeout(() => {
        statusEl.textContent = "";
        statusEl.className = "status-message";
      }, 1500);
    }
  }
}

// Initialize when popup loads
document.addEventListener("DOMContentLoaded", () => {
  new WoltFlowTokenReviewer();
});
