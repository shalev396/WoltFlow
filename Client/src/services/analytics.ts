// Google Analytics service with consent management
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Environment variables
const GA_TRACKING_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
const IS_DEVELOPMENT = import.meta.env.VITE_ENV === "dev";
const GA_SCRIPT_ID = "google-analytics-script";

class AnalyticsService {
  private isInitialized = false;
  private hasConsent = false;

  /**
   * Check if Google Analytics is properly configured
   */
  private isConfigured(): boolean {
    if (!GA_TRACKING_ID) {
      console.warn(
        "Google Analytics tracking ID not configured. Set VITE_GOOGLE_ANALYTICS_ID environment variable."
      );
      return false;
    }
    return true;
  }

  /**
   * Initialize Google Analytics with consent
   */
  public initialize(hasConsent: boolean): void {
    if (!this.isConfigured()) {
      return;
    }

    this.hasConsent = hasConsent;

    if (hasConsent && !this.isInitialized) {
      this.loadGoogleAnalytics();
    } else if (!hasConsent && this.isInitialized) {
      this.disableGoogleAnalytics();
    }
  }

  /**
   * Update consent status
   */
  public updateConsent(hasConsent: boolean): void {
    if (!this.isConfigured()) {
      return;
    }

    if (hasConsent && !this.isInitialized) {
      this.loadGoogleAnalytics();
    } else if (!hasConsent && this.isInitialized) {
      this.disableGoogleAnalytics();
    }
    this.hasConsent = hasConsent;
  }

  /**
   * Load Google Analytics - Simple implementation like official GA setup
   */
  private loadGoogleAnalytics(): void {
    // Don't load if already loaded
    if (document.getElementById(GA_SCRIPT_ID)) {
      return;
    }

    // Create dataLayer
    window.dataLayer = window.dataLayer || [];

    // Define gtag function
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

    // Initialize
    window.gtag("js", new Date());
    window.gtag("config", GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
      cookie_domain: "auto", // This is crucial for subdomain tracking
      debug_mode: IS_DEVELOPMENT,
    });

    // Load external script
    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    this.isInitialized = true;
    console.log("Google Analytics initialized");
  }

  /**
   * Disable Google Analytics
   */
  private disableGoogleAnalytics(): void {
    // Set the disable flag
    (window as unknown as Record<string, unknown>)[
      `ga-disable-${GA_TRACKING_ID}`
    ] = true;

    // Remove the script
    const script = document.getElementById(GA_SCRIPT_ID);
    script?.remove();

    // Clear gtag function
    window.gtag = undefined;

    this.isInitialized = false;
    console.log("Google Analytics disabled");
  }

  /**
   * Check if tracking is allowed and ready
   */
  private canTrack(): boolean {
    return (
      this.isConfigured() &&
      this.hasConsent &&
      this.isInitialized &&
      !!window.gtag
    );
  }

  /**
   * Track page view (only if consent given)
   */
  public trackPageView(page_path: string, page_title?: string): void {
    if (!this.canTrack()) return;

    window.gtag!("config", GA_TRACKING_ID, {
      page_path,
      page_title: page_title || document.title,
      cookie_domain: "auto",
      debug_mode: IS_DEVELOPMENT,
    });
  }

  /**
   * Track custom event (only if consent given)
   */
  public trackEvent(
    action: string,
    category: string,
    label?: string,
    value?: number
  ): void {
    if (!this.canTrack()) return;

    window.gtag!("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }

  /**
   * Get consent status
   */
  public getConsentStatus(): boolean {
    return this.hasConsent;
  }

  /**
   * Check if analytics is initialized
   */
  public isAnalyticsInitialized(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();
