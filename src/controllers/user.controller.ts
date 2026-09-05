import { Request, Response } from 'express';
import { z } from 'zod';
import { getUserById, updateBirthData, deleteUser } from '../services/user.service';

export async function me(req:Request,res:Response){ const u=await getUserById(req.user!.id); if(!u)return res.status(404).json({success:false,error:'Kullanıcı bulunamadı'}); res.json({success:true,data:u}); }
export async function birthData(req:Request,res:Response){ const body=z.object({date:z.string(),time:z.string(),city:z.string(),country:z.string().optional(),lat:z.number().optional(),lng:z.number().optional(),utcOffset:z.number().optional(),houseSystem:z.string().optional()}).parse(req.body); const u=await updateBirthData(req.user!.id,body); res.json({success:true,data:u.birthData}); }
export async function updateProfile(req:Request,res:Response){ const body=z.object({name:z.string().trim().min(1).max(100).optional()}).parse(req.body); const {pool}=await import('../db/database'); if(!pool) return res.status(503).json({success:false,error:'Veritabanı yapılandırılmamış'}); const r=await pool.query('UPDATE users SET name=COALESCE($2,name),updated_at=NOW() WHERE id=$1 RETURNING id,email,name,birth_data,created_at,updated_at',[req.user!.id,body.name]); res.json({success:true,data:r.rows[0]}); }
export async function exportData(req:Request,res:Response){ const u=await getUserById(req.user!.id); const sub=(await import('../services/user.service')).getSubscription; const subscription=await sub(req.user!.id); res.json({success:true,data:{user:u,subscription}}); }
export async function deleteAccount(req:Request,res:Response){ await deleteUser(req.user!.id); res.status(204).send(); }
