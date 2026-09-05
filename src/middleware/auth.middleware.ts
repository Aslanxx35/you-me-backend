import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.config';

declare global { namespace Express { interface Request { user?: { id: string; email: string }; } } }
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ success:false, error:'Kimlik doğrulama gerekli.' });
  try {
    const payload = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET) as { sub: string; email: string; type?: string };
    if (payload.type && payload.type !== 'access') throw new Error('Invalid token type');
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch { res.status(401).json({ success:false, error:'Geçersiz veya süresi dolmuş oturum.' }); }
}
