import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { env } from './env.config';
import { logger } from './logger.config';

const redis = env.REDIS_URL ? new Redis(env.REDIS_URL, { maxRetriesPerRequest: 1, lazyConnect: true }) : null;
const memory = new Map<string, { count: number; reset: number }>();

export function rateLimit(max: number, windowMs: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `rl:${req.ip}:${req.path}`;
    try {
      if (redis) {
        if (redis.status === 'wait') await redis.connect();
        const n = await redis.incr(key);
        if (n === 1) await redis.pexpire(key, windowMs);
        if (n > max) return res.status(429).json({ success: false, error: 'Çok fazla istek.' });
      } else {
        const now = Date.now(); const current = memory.get(key);
        if (!current || now >= current.reset) memory.set(key, { count: 1, reset: now + windowMs });
        else if (++current.count > max) return res.status(429).json({ success: false, error: 'Çok fazla istek.' });
      }
      next();
    } catch (err) {
      logger.warn({ err }, 'Rate limiter fallback');
      next();
    }
  };
}
