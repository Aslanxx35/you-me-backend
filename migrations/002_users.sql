CREATE TABLE IF NOT EXISTS users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
 name TEXT, birth_data JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS refresh_tokens (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 token_hash TEXT NOT NULL UNIQUE, expires_at TIMESTAMPTZ NOT NULL, revoked_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS subscriptions (
 user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, app_user_id TEXT UNIQUE,
 entitlement_id TEXT NOT NULL DEFAULT 'premium', product_id TEXT, status TEXT NOT NULL DEFAULT 'inactive',
 is_premium BOOLEAN NOT NULL DEFAULT FALSE, expires_at TIMESTAMPTZ, will_renew BOOLEAN NOT NULL DEFAULT FALSE,
 trial_ends_at TIMESTAMPTZ, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS refresh_tokens_user_idx ON refresh_tokens(user_id);
