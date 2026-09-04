# YOU me Backend 2.0

Production-oriented Express/TypeScript API for natal astrology, synastry, transit aspects, Tarot, AI readings and RevenueCat subscriptions.

## Runtime

- Node 20+
- PostgreSQL 14+
- Redis 6+ (optional locally; recommended in production)
- Swiss Ephemeris / Moshier fallback

## Security

Authentication uses short-lived JWT access tokens and rotating, hashed refresh tokens stored in PostgreSQL. Business endpoints are authenticated. Premium endpoints use server-side RevenueCat entitlement state.

In production, `DATABASE_URL`, JWT secrets, RevenueCat secrets and Sentry DSN are mandatory.

## API

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/natal-chart`
- `POST /api/v1/natal-chart/extended`
- `POST /api/v1/transit` (premium)
- `POST /api/v1/synastry`
- `GET /api/v1/daily`
- `GET /api/v1/tarot/deck`
- `POST /api/v1/tarot/draw` (premium)
- `POST /api/v1/ai/report` (premium)
- `GET /api/v1/subscription/status`
- `POST /api/v1/subscription/sync`
- `POST /api/v1/subscription/verify`
- `POST /api/v1/subscription/webhook`
- `GET /api/health`
- `GET /api/readiness`

## RevenueCat mobile binding

The React Native client must use `react-native-purchases` with a unique RevenueCat `appUserID` equal to the authenticated backend user ID (or a securely mapped stable ID), then call `/api/v1/subscription/sync` after login and purchase. The backend never trusts a client-provided premium flag.

## Test/build

```bash
npm ci
npm run typecheck
npm test -- --coverage
npm run build
npm start
