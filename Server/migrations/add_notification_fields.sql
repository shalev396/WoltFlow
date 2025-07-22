-- Migration: Add notification fields to Settings table
-- Run this SQL script on your PostgreSQL database

-- Step 1: Create the enum type for notification methods
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Settings_notificationMethod') THEN
        CREATE TYPE "enum_Settings_notificationMethod" AS ENUM ('sms', 'email');
    END IF;
END $$;

-- Step 2: Add the new columns to the Settings table
ALTER TABLE "Settings" 
ADD COLUMN IF NOT EXISTS "notificationMethod" "enum_Settings_notificationMethod" DEFAULT NULL;
