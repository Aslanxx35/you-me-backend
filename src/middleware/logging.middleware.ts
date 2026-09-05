import pinoHttp from 'pino-http';
import { logger } from '../config/logger.config';
export const loggingMiddleware = pinoHttp({ logger, autoLogging: true, redact: ['req.headers.authorization'] });
