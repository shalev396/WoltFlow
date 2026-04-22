import dotenv from "dotenv";
import sequelize from "./database.js";
import { initializeModelRelationships } from "../models/index.js";
// Import all new models
import "../models/index.js";

dotenv.config();

/**
 * Idempotent destructive cleanup that runs before sync({ alter: true }).
 *
 * Removes legacy schema artifacts left over from the email-forwarding /
 * daily-code pipeline and the old `automationMode` selector, so the next
 * sync can succeed without FK / enum-shrink errors. Safe to re-run.
 */
async function cleanupObsoleteSchema(): Promise<void> {
  const statements: { label: string; sql: string }[] = [
    {
      label: "backfill obsolete Run.stage values to 'completed'",
      sql: `UPDATE "Runs"
              SET "stage" = 'completed'
              WHERE "stage" IN ('getting_code_from_email','applying_gift');`,
    },
    {
      label: "drop Codes table",
      sql: `DROP TABLE IF EXISTS "Codes" CASCADE;`,
    },
    {
      label: "drop Emails table",
      sql: `DROP TABLE IF EXISTS "Emails" CASCADE;`,
    },
    {
      label: "drop Inbox table",
      sql: `DROP TABLE IF EXISTS "Inbox" CASCADE;`,
    },
    {
      label: "drop RunSettings.automationMode column",
      sql: `ALTER TABLE "RunSettings" DROP COLUMN IF EXISTS "automationMode";`,
    },
    {
      label: "drop Runs.automationMode column",
      sql: `ALTER TABLE "Runs" DROP COLUMN IF EXISTS "automationMode";`,
    },
    {
      label: "drop enum_RunSettings_automationMode type",
      sql: `DROP TYPE IF EXISTS "enum_RunSettings_automationMode";`,
    },
    {
      label: "drop enum_Runs_automationMode type",
      sql: `DROP TYPE IF EXISTS "enum_Runs_automationMode";`,
    },
    {
      // Postgres has no DROP VALUE for enums, so swap the type out.
      // Wrapped in DO block so the whole shrink is atomic + idempotent.
      label: "shrink enum_Runs_stage to live values only",
      sql: `DO $$
              BEGIN
                IF EXISTS (
                  SELECT 1
                  FROM pg_type t
                  JOIN pg_enum e ON e.enumtypid = t.oid
                  WHERE t.typname = 'enum_Runs_stage'
                    AND e.enumlabel IN ('getting_code_from_email','applying_gift')
                ) THEN
                  ALTER TYPE "enum_Runs_stage" RENAME TO "enum_Runs_stage_old";
                  CREATE TYPE "enum_Runs_stage" AS ENUM (
                    'triggered','refreshing_tokens','buying_gift','completed'
                  );
                  ALTER TABLE "Runs"
                    ALTER COLUMN "stage" DROP DEFAULT,
                    ALTER COLUMN "stage" TYPE "enum_Runs_stage"
                      USING ("stage"::text::"enum_Runs_stage"),
                    ALTER COLUMN "stage" SET DEFAULT 'triggered'::"enum_Runs_stage";
                  DROP TYPE "enum_Runs_stage_old";
                END IF;
              END $$;`,
    },
  ];

  for (const { label, sql } of statements) {
    try {
      await sequelize.query(sql);
      console.log(`🧹 cleanup ok: ${label}`);
    } catch (err) {
      console.warn(`⚠️ cleanup skipped (${label}):`, err);
    }
  }
}

// Export a function to sync database instead of doing it at module load time
export async function syncDatabase() {
  try {
    // Initialize model relationships before syncing
    initializeModelRelationships();

    await cleanupObsoleteSchema();

    await sequelize
      .sync({ alter: true })
      .then(() => {
        console.log("✅ Database synchronized");
      })
      .catch((err) => {
        console.error("❌ Sync error:", err);
        throw err;
      });
  } catch (err) {
    console.error("❌ Sync error:", err);
    throw err;
  }
}

export async function initDB() {
  await sequelize.authenticate();
  initializeModelRelationships();
}
