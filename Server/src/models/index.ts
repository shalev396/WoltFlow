// Import all models
import User from "./User.js";
import NotificationSettings from "./NotificationSettings.js";
import WoltSettings from "./WoltSettings.js";
import Settings from "./Settings.js";
import TwoFactorAuthentication from "./TwoFactorAuthentication.js";
import Inbox from "./Inbox.js";
import Emails from "./Emails.js";
import RunSettings from "./RunSettings.js";
import Run from "./Run.js";
import Code from "./Code.js";
import Screenshot from "./Screenshot.js";

// Track if relationships have been initialized to prevent duplicates
let relationshipsInitialized = false;

// Define all relationships here to avoid circular dependency issues
function initializeModelRelationships() {
  // Prevent duplicate initialization
  if (relationshipsInitialized) {
    return;
  }
  relationshipsInitialized = true;
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

  // Settings -> RunSettings (1:1)
  Settings.belongsTo(RunSettings, {
    foreignKey: "runSettingsId",
    as: "runSettings",
  });
  RunSettings.hasOne(Settings, {
    foreignKey: "runSettingsId",
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

  // Emails -> Code (extracted from emails) (1:1) - Each email contains exactly one code
  Emails.hasOne(Code, {
    foreignKey: "emailId",
    as: "extractedCode",
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
  Settings,
  TwoFactorAuthentication,
  Inbox,
  Emails,
  RunSettings,
  Run,
  Code,
  Screenshot,
  initializeModelRelationships,
};
