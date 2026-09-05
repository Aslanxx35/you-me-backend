import { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({ success: true, data, timestamp: new Date().toISOString() });
}

export function sendError(res: Response, error: string, status = 500): void {
  res.status(status).json({ success: false, error, timestamp: new Date().toISOString() });
}
