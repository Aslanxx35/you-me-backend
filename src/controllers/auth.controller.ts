import { Request, Response } from 'express';
import { z } from 'zod';
import { login, logout, refreshSession, register, requestPasswordReset, resetPassword } from '../services/auth.service';
import { getUserById } from '../services/user.service';

const credentials=z.object({email:z.string().email().max(254),password:z.string().min(8).max(128),name:z.string().trim().min(1).max(100).optional()});
export async function registerController(req:Request,res:Response){const p=credentials.parse(req.body); const r=await register(p); res.status(201).json({success:true,data:{...r.tokens,user:r.user}});}
export async function loginController(req:Request,res:Response){const p=credentials.pick({email:true,password:true}).parse(req.body); const r=await login(p.email,p.password); res.json({success:true,data:{...r.tokens,user:r.user}});}
export async function refreshController(req:Request,res:Response){const p=z.object({refreshToken:z.string().min(20)}).parse(req.body); const r=await refreshSession(p.refreshToken); res.json({success:true,data:{...r.tokens,user:r.user}});}
export async function logoutController(req:Request,res:Response){await logout(req.user!.id);res.status(204).send();}
export async function meController(req:Request,res:Response){const u=await getUserById(req.user!.id); if(!u)return res.status(404).json({success:false,error:'Kullanıcı bulunamadı'});res.json({success:true,data:u});}

export async function forgotPasswordController(req:Request,res:Response){const p=z.object({email:z.string().email()}).parse(req.body);await requestPasswordReset(p.email);res.status(202).json({success:true,message:'Eğer hesap mevcutsa sıfırlama bağlantısı gönderildi.'});}
export async function resetPasswordController(req:Request,res:Response){const p=z.object({token:z.string().min(32),password:z.string().min(8).max(128)}).parse(req.body);await resetPassword(p.token,p.password);res.json({success:true,message:'Şifre güncellendi.'});}
