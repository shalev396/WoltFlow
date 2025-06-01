-- Drop tables if they exist
DROP TABLE IF EXISTS screenshots;
DROP TABLE IF EXISTS runs;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255)  NOT NULL,
    password        VARCHAR(255)  NOT NULL,
    in_notification BOOLEAN       DEFAULT FALSE,
    total_saved     REAL          DEFAULT 0.0
);

-- Create runs table
CREATE TABLE runs (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL
                    REFERENCES users(id) ON DELETE CASCADE,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status       VARCHAR(20)   NOT NULL DEFAULT 'in progress'
                    CHECK (status IN ('failed', 'in progress', 'success')),
    amount       REAL          NOT NULL DEFAULT 0.0,
    is_notify    BOOLEAN       DEFAULT FALSE
);

-- (Optional) Trigger to auto-update updated_at on row modification:
-- CREATE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE TRIGGER trg_update_runs_updated_at
-- BEFORE UPDATE ON runs
-- FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create screenshots table
CREATE TABLE screenshots (
    id        SERIAL PRIMARY KEY,
    run_id    INTEGER NOT NULL
                 REFERENCES runs(id) ON DELETE CASCADE,
    url       VARCHAR(255) NOT NULL,
    is_error  BOOLEAN       DEFAULT FALSE
);

-- Create indexes
CREATE INDEX idx_runs_user_id         ON runs(user_id);
CREATE INDEX idx_screenshots_run_id   ON screenshots(run_id);
CREATE INDEX idx_users_email          ON users(email);
