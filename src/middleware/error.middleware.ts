import { Request,Response,NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger.config';
import { Sentry } from '../config/sentry.config';
export class AppError extends Error{constructor(public statusCode:number,message:string,public code='APP_ERROR'){super(message)}}
export function asyncHandler(fn:any){return(req:Request,res:Response,next:NextFunction)=>Promise.resolve(fn(req,res,next)).catch(next)}
export function errorMiddleware(err:any,req:Request,res:Response,_next:NextFunction){logger.error({err,method:req.method,path:req.path,requestId:req.id},'Unhandled request error');if(err?.name!=='ZodError')Sentry.captureException(err);if(err instanceof ZodError)return res.status(400).json({success:false,error:err.issues[0]?.message||'Geçersiz istek',code:'VALIDATION_ERROR'});const status=err instanceof AppError?err.statusCode:500;res.status(status).json({success:false,error:status===500?'Sunucu hatası, lütfen tekrar dene.':err.message,code:err.code||'INTERNAL_ERROR'});}
