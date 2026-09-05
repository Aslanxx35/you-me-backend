CREATE TABLE IF NOT EXISTS synastry_history (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS synastry_history_user_idx ON synastry_history(user_id, created_at DESC);
CREATE TABLE IF NOT EXISTS transit_history (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS transit_history_user_idx ON transit_history(user_id, created_at DESC);
