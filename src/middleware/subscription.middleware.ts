import { Request, Response, NextFunction } from 'express';
import { getSubscription } from '../services/user.service';
export async function requirePremium(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ success:false, error:'Kimlik doğrulama gerekli.' });
  try { const sub = await getSubscription(req.user.id); const trialActive=!!sub?.trialEndsAt && new Date(sub.trialEndsAt).getTime()>Date.now(); if (!sub?.isPremium && !trialActive) return res.status(402).json({ success:false, error:'Premium abonelik gerekli.' }); next(); }
  catch { res.status(503).json({ success:false, error:'Abonelik durumu doğrulanamadı.' }); }
}
