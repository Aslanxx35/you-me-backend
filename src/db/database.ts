import { Pool } from 'pg';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';

export const pool = env.DATABASE_URL ? new Pool({ connectionString: env.DATABASE_URL, max: 10, ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined }) : null;

export async function initDatabase() {
  if (!pool) { if (env.NODE_ENV === 'production') throw new Error('DATABASE_URL gerekli'); return; }
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      birth_data JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      app_user_id TEXT UNIQUE,
      entitlement_id TEXT NOT NULL DEFAULT 'premium',
      product_id TEXT,
      status TEXT NOT NULL DEFAULT 'inactive',
      is_premium BOOLEAN NOT NULL DEFAULT FALSE,
      expires_at TIMESTAMPTZ,
      will_renew BOOLEAN NOT NULL DEFAULT FALSE,
      trial_ends_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS refresh_tokens_user_idx ON refresh_tokens(user_id);
    CREATE TABLE IF NOT EXISTS synastry_history (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
    CREATE INDEX IF NOT EXISTS synastry_history_user_idx ON synastry_history(user_id, created_at DESC);
    CREATE TABLE IF NOT EXISTS transit_history (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
    CREATE INDEX IF NOT EXISTS transit_history_user_idx ON transit_history(user_id, created_at DESC);
    CREATE TABLE IF NOT EXISTS password_resets (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, token_hash TEXT NOT NULL UNIQUE, expires_at TIMESTAMPTZ NOT NULL, used_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
    CREATE INDEX IF NOT EXISTS password_resets_user_idx ON password_resets(user_id, created_at DESC);
  `);
  logger.info('Database initialized');
}
