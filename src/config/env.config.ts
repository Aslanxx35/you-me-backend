import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url().optional(),
  JWT_ACCESS_SECRET: z.string().min(32).default('development-access-secret-change-me-please'),
  JWT_REFRESH_SECRET: z.string().min(32).default('development-refresh-secret-change-me-please'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_DAYS: z.coerce.number().int().positive().default(30),
  CORS_ALLOWED_ORIGINS: z.string().default('http://localhost:8081'),
  REDIS_URL: z.string().url().optional(),
  REVENUECAT_SECRET_KEY: z.string().optional(),
  REVENUECAT_WEBHOOK_SECRET: z.string().optional(),
  REVENUECAT_ENTITLEMENT_ID: z.string().default('premium'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  SENTRY_DSN: z.string().optional(),
  SMTP_HOST: z.string().optional(), SMTP_PORT: z.coerce.number().int().positive().optional(), SMTP_USER: z.string().optional(), SMTP_PASS: z.string().optional(), SMTP_FROM: z.string().email().optional(), RESET_URL: z.string().url().optional(),
  LOG_LEVEL: z.enum(['fatal','error','warn','info','debug','trace']).default('info'),
  TRUST_PROXY: z.coerce.boolean().default(false)
}).superRefine((v, ctx) => {
  if (v.NODE_ENV === 'production') {
    for (const key of ['DATABASE_URL', 'REVENUECAT_SECRET_KEY', 'REVENUECAT_WEBHOOK_SECRET', 'SENTRY_DSN'] as const) {
      if (!v[key]) ctx.addIssue({ code: 'custom', path: [key], message: `${key} production ortamında zorunlu` });
    }
    if (v.JWT_ACCESS_SECRET.includes('change-me') || v.JWT_REFRESH_SECRET.includes('change-me')) {
      ctx.addIssue({ code: 'custom', path: ['JWT_ACCESS_SECRET'], message: 'Production JWT secretleri değiştirilmelidir' });
    }
  }
});

export const env = schema.parse(process.env);
export const isProduction = env.NODE_ENV === 'production';
