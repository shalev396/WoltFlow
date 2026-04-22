// Import all models
import User from "./User.js";
import NotificationSettings from "./NotificationSettings.js";
import WoltSettings from "./WoltSettings.js";
import Settings from "./Settings.js";
import TwoFactorAuthentication from "./TwoFactorAuthentication.js";
import RunSettings from "./RunSettings.js";
import Run from "./Run.js";
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

  // User -> Run (1:N) - Users can have multiple automation runs
  User.hasMany(Run, {
    foreignKey: "userId",
    as: "runs",
  });
  Run.belongsTo(User, {
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
}

// Export all models after relationships are defined
export {
  User,
  NotificationSettings,
  WoltSettings,
  Settings,
  TwoFactorAuthentication,
  RunSettings,
  Run,
  Screenshot,
  initializeModelRelationships,
};
