import cors from 'cors';
import { env, isProduction } from './env.config';
const origins = env.CORS_ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
export const corsMiddleware = cors({
  origin: (origin, cb) => {
    if (!origin || (!isProduction && origins.length === 0)) return cb(null, true);
    if (origins.includes(origin)) return cb(null, true);
    cb(new Error('CORS origin not allowed'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']
});
