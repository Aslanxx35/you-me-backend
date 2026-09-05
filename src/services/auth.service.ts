import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { createUser, revokeAllRefreshTokens, rotateRefreshToken, saveRefreshToken, verifyCredentials, upsertSubscription, getUserById, hashToken } from './user.service';
import bcrypt from 'bcrypt';
import { pool } from '../db/database';
import { env } from '../config/env.config';
import nodemailer from 'nodemailer';

function access(user: User) { return jwt.sign({ sub:user.id, email:user.email, type:'access' }, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL as any }); }
function refresh(user: User) { return jwt.sign({ sub:user.id, email:user.email, type:'refresh', jti:crypto.randomUUID() }, env.JWT_REFRESH_SECRET, { expiresIn:`${env.REFRESH_TOKEN_DAYS}d` }); }
export async function register(input:{email:string;password:string;name?:string}) { const user=await createUser(input.email,input.password,input.name); await upsertSubscription(user.id,{appUserId:user.id,entitlementId:env.REVENUECAT_ENTITLEMENT_ID,productId:null,status:'trial',isPremium:true,expiresAt:null,willRenew:false,trialEndsAt:new Date(Date.now()+3*86400000).toISOString()}); const tokens=await issue(user); return {user,tokens}; }
export async function login(email:string,password:string) { const user=await verifyCredentials(email,password); return {user,tokens:await issue(user)}; }
async function issue(user:User){const a=access(user), r=refresh(user); await saveRefreshToken(user.id,r,new Date(Date.now()+env.REFRESH_TOKEN_DAYS*86400000)); return {accessToken:a,refreshToken:r};}
export async function refreshSession(raw:string){ const decoded=jwt.verify(raw,env.JWT_REFRESH_SECRET) as {sub:string;type:string}; if(decoded.type!=='refresh') throw new Error('Invalid refresh type'); const userId=await rotateRefreshToken(raw); const u=await getUserById(userId); if(!u) throw new Error('User not found'); return {user:u,tokens:await issue(u)}; }
export async function logout(userId:string){await revokeAllRefreshTokens(userId);}

export async function requestPasswordReset(email:string){
  if(!pool) return;
  const r=await pool.query('SELECT id,email,name FROM users WHERE email=$1',[email.toLowerCase()]);
  if(!r.rows[0]) return;
  const raw=crypto.randomBytes(32).toString('hex'); const expires=new Date(Date.now()+30*60*1000);
  await pool.query('UPDATE password_resets SET used_at=NOW() WHERE user_id=$1 AND used_at IS NULL',[r.rows[0].id]);
  await pool.query('INSERT INTO password_resets(user_id,token_hash,expires_at) VALUES($1,$2,$3)',[r.rows[0].id,hashToken(raw),expires]);
  if(env.SMTP_HOST&&env.SMTP_PORT&&env.SMTP_USER&&env.SMTP_PASS&&env.SMTP_FROM&&env.RESET_URL){
    const transporter=nodemailer.createTransport({host:env.SMTP_HOST,port:env.SMTP_PORT,secure:env.SMTP_PORT===465,auth:{user:env.SMTP_USER,pass:env.SMTP_PASS}});
    const url=`${env.RESET_URL}?token=${encodeURIComponent(raw)}`;
    await transporter.sendMail({from:env.SMTP_FROM,to:r.rows[0].email,subject:'YOU me şifre sıfırlama',text:`Şifreni sıfırlamak için: ${url}`});
  }
}
export async function resetPassword(token:string,password:string){
  if(!pool) throw new Error('Veritabanı yapılandırılmamış');
  const hash=hashToken(token); const r=await pool.query('SELECT user_id FROM password_resets WHERE token_hash=$1 AND used_at IS NULL AND expires_at>NOW()',[hash]); const row=r.rows[0]; if(!row) throw new Error('Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.');
  const passwordHash=await bcrypt.hash(password,12); await pool.query('UPDATE users SET password_hash=$2,updated_at=NOW() WHERE id=$1',[row.user_id,passwordHash]); await pool.query('UPDATE password_resets SET used_at=NOW() WHERE token_hash=$1',[hash]); await revokeAllRefreshTokens(row.user_id);
}
