import pino from 'pino';
import { env } from './env.config';
export const logger = pino({ level: env.LOG_LEVEL, redact: ['req.headers.authorization', 'password', 'refreshToken', 'token'] });
