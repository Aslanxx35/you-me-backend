import { Request,Response } from 'express';
import { z } from 'zod';
import { bindRevenueCatUser, verifyPremiumStatus } from '../services/revenuecat.service';
import { getSubscription } from '../services/user.service';
export async function status(req:Request,res:Response){const local=await getSubscription(req.user!.id);res.json({success:true,data:local});}
export async function sync(req:Request,res:Response){const p=z.object({appUserId:z.string().min(1).max(200)}).parse(req.body);res.json({success:true,data:await bindRevenueCatUser(req.user!.id,p.appUserId)});}
export async function verify(req:Request,res:Response){const p=z.object({appUserId:z.string().min(1)}).parse(req.body);if(p.appUserId!==req.user!.id)return res.status(403).json({success:false,error:'appUserId kullanıcıyla eşleşmiyor'});res.json({success:true,data:await verifyPremiumStatus(p.appUserId)});}
export async function webhook(req:Request,res:Response){const {processWebhook,isValidWebhookAuth}=await import('../services/revenuecat.service');if(!isValidWebhookAuth(req.headers.authorization))return res.status(401).json({success:false,error:'Webhook doğrulaması başarısız'});await processWebhook(req.body.event||req.body);res.status(204).send();}
