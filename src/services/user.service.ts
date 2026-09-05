import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { pool } from '../db/database';
import { AppError } from '../middleware/error.middleware';
import { Subscription, User } from '../models/User';

function requireDb() { if (!pool) throw new AppError(503, 'Veritabanı yapılandırılmamış.', 'DB_UNAVAILABLE'); return pool; }

export async function createUser(email: string, password: string, name?: string) {
  const db = requireDb();
  const hash = await bcrypt.hash(password, 12);
  try {
    const r = await db.query('INSERT INTO users(email,password_hash,name) VALUES($1,$2,$3) RETURNING id,email,name,created_at,updated_at', [email.toLowerCase(), hash, name || null]);
    return mapUser(r.rows[0]);
  } catch (e: any) { if (e.code === '23505') throw new AppError(409, 'Bu e-posta zaten kayıtlı.', 'EMAIL_EXISTS'); throw e; }
}
export async function verifyCredentials(email: string, password: string) {
  const db = requireDb(); const r = await db.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase()]);
  const row = r.rows[0]; if (!row || !(await bcrypt.compare(password, row.password_hash))) throw new AppError(401, 'E-posta veya şifre hatalı.', 'INVALID_CREDENTIALS');
  return mapUser(row);
}
export async function getUserById(id: string): Promise<User | null> { const db = requireDb(); const r = await db.query('SELECT id,email,name,birth_data,created_at,updated_at FROM users WHERE id=$1', [id]); return r.rows[0] ? mapUser(r.rows[0]) : null; }
export async function updateBirthData(id: string, birthData: Record<string, unknown>) { const db = requireDb(); const r = await db.query('UPDATE users SET birth_data=$2,updated_at=NOW() WHERE id=$1 RETURNING id,email,name,birth_data,created_at,updated_at',[id,birthData]); return mapUser(r.rows[0]); }
export async function saveRefreshToken(userId: string, raw: string, expiresAt: Date) { const db = requireDb(); const hash=hashToken(raw); await db.query('INSERT INTO refresh_tokens(user_id,token_hash,expires_at) VALUES($1,$2,$3)',[userId,hash,expiresAt]); }
export async function rotateRefreshToken(raw: string) { const db = requireDb(); const hash=hashToken(raw); const r=await db.query('SELECT * FROM refresh_tokens WHERE token_hash=$1 AND revoked_at IS NULL AND expires_at>NOW()',[hash]); const row=r.rows[0]; if(!row) throw new AppError(401,'Refresh token geçersiz.','INVALID_REFRESH_TOKEN'); await db.query('UPDATE refresh_tokens SET revoked_at=NOW() WHERE id=$1',[row.id]); return row.user_id as string; }
export async function revokeAllRefreshTokens(userId:string){ const db=requireDb(); await db.query('UPDATE refresh_tokens SET revoked_at=NOW() WHERE user_id=$1 AND revoked_at IS NULL',[userId]); }
export async function upsertSubscription(userId: string, data: Omit<Subscription,'userId'>) { const db=requireDb(); const r=await db.query(`INSERT INTO subscriptions(user_id,app_user_id,entitlement_id,product_id,status,is_premium,expires_at,will_renew,trial_ends_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(user_id) DO UPDATE SET app_user_id=EXCLUDED.app_user_id,entitlement_id=EXCLUDED.entitlement_id,product_id=EXCLUDED.product_id,status=EXCLUDED.status,is_premium=EXCLUDED.is_premium,expires_at=EXCLUDED.expires_at,will_renew=EXCLUDED.will_renew,trial_ends_at=EXCLUDED.trial_ends_at,updated_at=NOW() RETURNING *`,[userId,data.appUserId,data.entitlementId,data.productId,data.status,data.isPremium,data.expiresAt,data.willRenew,data.trialEndsAt]); return mapSubscription(r.rows[0]); }
export async function getSubscription(userId:string):Promise<Subscription|null>{ const db=requireDb(); const r=await db.query('SELECT * FROM subscriptions WHERE user_id=$1',[userId]); return r.rows[0]?mapSubscription(r.rows[0]):null; }
export function hashToken(token:string){return crypto.createHash('sha256').update(token).digest('hex');}
function mapUser(r:any):User{return {id:r.id,email:r.email,name:r.name??null,birthData:r.birth_data??null,createdAt:r.created_at.toISOString(),updatedAt:r.updated_at.toISOString()};}
function mapSubscription(r:any):Subscription{const trialEnds=r.trial_ends_at?.toISOString?.()??null;const trialActive=!!trialEnds&&new Date(trialEnds).getTime()>Date.now();const active=Boolean(r.is_premium)&&(r.status!=='trial'||trialActive);return {userId:r.user_id,appUserId:r.app_user_id,entitlementId:r.entitlement_id,productId:r.product_id,status:active?r.status:'expired',isPremium:active,expiresAt:r.expires_at?.toISOString?.()??null,willRenew:Boolean(r.will_renew),trialEndsAt:trialEnds};}

export async function deleteUser(id:string){ const db=requireDb(); await db.query('DELETE FROM users WHERE id=$1',[id]); }
