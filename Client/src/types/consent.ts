export interface ConsentPreferences {
  analytics: boolean; // true = accept all, false = essential only
  timestamp: number;
}

export interface ConsentState {
  hasConsented: boolean;
  preferences: ConsentPreferences;
  showBanner: boolean;
}
