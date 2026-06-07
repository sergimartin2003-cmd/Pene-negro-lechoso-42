-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username      VARCHAR(50) UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url    TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Linked gaming accounts (the core of the unified profile)
CREATE TABLE IF NOT EXISTS linked_accounts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id      VARCHAR(50) NOT NULL,
    external_id  TEXT NOT NULL,
    display_name TEXT NOT NULL,
    region       VARCHAR(20),
    is_verified  BOOLEAN DEFAULT FALSE,
    linked_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (game_id, external_id)
);

-- Stats snapshots (cached in DB as fallback when Redis is cold)
CREATE TABLE IF NOT EXISTS player_stats_snapshots (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    linked_account_id UUID NOT NULL REFERENCES linked_accounts(id) ON DELETE CASCADE,
    fetched_at        TIMESTAMPTZ DEFAULT NOW(),
    stats_json        JSONB NOT NULL,
    raw_json          JSONB
);

-- Match history
CREATE TABLE IF NOT EXISTS match_history (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    linked_account_id UUID NOT NULL REFERENCES linked_accounts(id) ON DELETE CASCADE,
    match_external_id TEXT NOT NULL,
    game_id           VARCHAR(50) NOT NULL,
    played_at         TIMESTAMPTZ NOT NULL,
    duration_seconds  INT,
    result            VARCHAR(10) CHECK (result IN ('win', 'loss', 'draw')),
    stats_json        JSONB NOT NULL,
    UNIQUE (game_id, match_external_id, linked_account_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_linked_accounts_user    ON linked_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_game    ON linked_accounts(game_id, external_id);
CREATE INDEX IF NOT EXISTS idx_stats_account_time      ON player_stats_snapshots(linked_account_id, fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_match_history_account   ON match_history(linked_account_id, played_at DESC);
