// Import all models
import User from "./User.js";
import NotificationSettings from "./NotificationSettings.js";
import WoltSettings from "./WoltSettings.js";
import CibusSettings from "./CibusSettings.js";
import Settings from "./Settings.js";
import TwoFactorAuthentication from "./TwoFactorAuthentication.js";
import Cibus2FA from "./Cibus2FA.js";
import Inbox from "./Inbox.js";
import Emails from "./Emails.js";
import RunSettings from "./RunSettings.js";
import Run from "./Run.js";
import Code from "./Code.js";
import Screenshot from "./Screenshot.js";

// Define all relationships here to avoid circular dependency issues
function initializeModelRelationships() {
  // ============================================================================
  // USER RELATIONSHIPS
  // ============================================================================

  // User -> Settings (1:1) - Each user has one main settings hub
  User.hasOne(Settings, {
    foreignKey: "userId",
    as: "settings",
  });
  Settings.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // User -> Inbox (1:1) - Each user has one email inbox
  User.hasOne(Inbox, {
    foreignKey: "userId",
    as: "inbox",
  });
  Inbox.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // User -> Run (1:N) - Users can have multiple automation runs
  User.hasMany(Run, {
    foreignKey: "userId",
    as: "runs",
  });
  Run.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // User -> Code (1:N) - Users can have multiple gift codes
  User.hasMany(Code, {
    foreignKey: "userId",
    as: "codes",
  });
  Code.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // User -> Cibus2FA (1:N) - Users can have multiple Cibus 2FA codes
  User.hasMany(Cibus2FA, {
    foreignKey: "userId",
    as: "cibus2FAcodes",
  });
  Cibus2FA.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // ============================================================================
  // SETTINGS RELATIONSHIPS (All 1:1 with main Settings hub)
  // ============================================================================

  // Settings -> NotificationSettings (1:1)
  Settings.belongsTo(NotificationSettings, {
    foreignKey: "notificationSettingsId",
    as: "notificationSettings",
  });
  NotificationSettings.hasOne(Settings, {
    foreignKey: "notificationSettingsId",
    as: "settings",
  });

  // Settings -> WoltSettings (1:1)
  Settings.belongsTo(WoltSettings, {
    foreignKey: "woltSettingsId",
    as: "woltSettings",
  });
  WoltSettings.hasOne(Settings, {
    foreignKey: "woltSettingsId",
    as: "settings",
  });

  // Settings -> CibusSettings (1:1)
  Settings.belongsTo(CibusSettings, {
    foreignKey: "cibusSettingsId",
    as: "cibusSettings",
  });
  CibusSettings.hasOne(Settings, {
    foreignKey: "cibusSettingsId",
    as: "settings",
  });

  // Settings -> RunSettings (1:1)
  Settings.hasOne(RunSettings, {
    foreignKey: "settingsId",
    as: "runSettings",
  });
  RunSettings.belongsTo(Settings, {
    foreignKey: "settingsId",
    as: "settings",
  });

  // ============================================================================
  // NOTIFICATION & 2FA RELATIONSHIPS
  // ============================================================================

  // NotificationSettings -> TwoFactorAuthentication (1:N)
  NotificationSettings.hasMany(TwoFactorAuthentication, {
    foreignKey: "notificationSettingsId",
    as: "twoFactorAuthentications",
  });
  TwoFactorAuthentication.belongsTo(NotificationSettings, {
    foreignKey: "notificationSettingsId",
    as: "notificationSettings",
  });

  // ============================================================================
  // EMAIL RELATIONSHIPS
  // ============================================================================

  // Inbox -> Emails (1:N) - Each inbox can receive multiple emails
  Inbox.hasMany(Emails, {
    foreignKey: "inboxId",
    as: "emails",
  });
  Emails.belongsTo(Inbox, {
    foreignKey: "inboxId",
    as: "inbox",
  });

  // ============================================================================
  // SCREENSHOT RELATIONSHIPS
  // ============================================================================

  // Run -> Screenshot (1:N) - Each run can have multiple screenshots
  Run.hasMany(Screenshot, {
    foreignKey: "runId",
    as: "screenshots",
  });
  Screenshot.belongsTo(Run, {
    foreignKey: "runId",
    as: "run",
  });

  // ============================================================================
  // CODE RELATIONSHIPS
  // ============================================================================

  // Run -> Code (generated codes) (1:N) - Each run can generate multiple codes
  Run.hasMany(Code, {
    foreignKey: "runId",
    as: "generatedCodes",
  });
  Code.belongsTo(Run, {
    foreignKey: "runId",
    as: "generatedByRun",
  });

  // Emails -> Code (extracted from emails) (1:N) - Each email can contain multiple codes
  Emails.hasMany(Code, {
    foreignKey: "emailId",
    as: "extractedCodes",
  });
  Code.belongsTo(Emails, {
    foreignKey: "emailId",
    as: "sourceEmail",
  });
}

// Export all models after relationships are defined
export {
  User,
  NotificationSettings,
  WoltSettings,
  CibusSettings,
  Settings,
  TwoFactorAuthentication,
  Cibus2FA,
  Inbox,
  Emails,
  RunSettings,
  Run,
  Code,
  Screenshot,
  initializeModelRelationships,
};
