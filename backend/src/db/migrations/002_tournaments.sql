CREATE TABLE IF NOT EXISTS tournaments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id      UUID REFERENCES users(id) ON DELETE SET NULL,
    title           VARCHAR(150) NOT NULL,
    description     TEXT,
    game_id         VARCHAR(50) NOT NULL,
    entry_fee       NUMERIC(10,2) NOT NULL DEFAULT 0,
    prize_pool      NUMERIC(10,2) NOT NULL DEFAULT 0,
    currency        VARCHAR(10) NOT NULL DEFAULT 'EUR',
    max_players     INT NOT NULL DEFAULT 100,
    current_players INT NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open','full','in_progress','finished','cancelled')),
    starts_at       TIMESTAMPTZ NOT NULL,
    ends_at         TIMESTAMPTZ,
    rules           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tournament_participants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id   UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    display_name    VARCHAR(100) NOT NULL,
    game_username   VARCHAR(100) NOT NULL,
    joined_at       TIMESTAMPTZ DEFAULT NOW(),
    placement       INT,
    credits_paid    NUMERIC(10,2) NOT NULL DEFAULT 0,
    UNIQUE (tournament_id, display_name)
);

CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status, starts_at);
CREATE INDEX IF NOT EXISTS idx_participants_tournament ON tournament_participants(tournament_id);

-- Seed some sample tournaments
INSERT INTO tournaments (title, game_id, entry_fee, prize_pool, max_players, current_players, status, starts_at, description) VALUES
('Valorant Weekly Cup #12', 'valorant', 1.00, 47.00, 100, 47, 'open', NOW() + INTERVAL '2 days', 'Weekly community tournament. Top 3 win prizes!'),
('CS2 Friday Showdown', 'cs2', 2.00, 28.00, 50, 14, 'open', NOW() + INTERVAL '1 day', 'Friday night CS2 tournament for all skill levels.'),
('Fortnite 100-Player Drop', 'fortnite', 1.00, 89.00, 100, 89, 'open', NOW() + INTERVAL '3 hours', 'Classic 100-player Fortnite battle royale tournament.'),
('Multi-Game Champions', 'multi', 5.00, 120.00, 32, 24, 'open', NOW() + INTERVAL '5 days', 'Compete across multiple games. Best overall player wins.'),
('CS2 Pro League Season 3', 'cs2', 10.00, 200.00, 16, 16, 'full', NOW() + INTERVAL '1 day', 'Elite CS2 tournament. Full — good luck!'),
('Valorant Beginner Cup', 'valorant', 0.50, 12.00, 64, 24, 'open', NOW() + INTERVAL '4 days', 'For new players only. Iron to Silver ranks welcome.');
