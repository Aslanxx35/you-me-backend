import express from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './config/cors.config';
import { rateLimit } from './config/rateLimit.config';
import { initSentry } from './config/sentry.config';
import { env } from './config/env.config';
import { logger } from './config/logger.config';
import { loggingMiddleware } from './middleware/logging.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import chartRoutes from './routes/chart.routes';
import subscriptionRoutes from './routes/subscription.routes';
import natalRoutesV1 from './routes/natal.routes.v1';
import userRoutes from './routes/user.routes';
import clientErrorRoutes from './routes/clientError.routes';
import { initSwissEphemeris } from './config/swisseph.config';
import { initDatabase,pool } from './db/database';

initSentry(); initSwissEphemeris();
export const app=express(); app.set('trust proxy',env.TRUST_PROXY); app.use(helmet()); app.use(corsMiddleware); app.use(express.json({limit:'1mb'})); app.use(loggingMiddleware); app.use('/api',rateLimit(120,60_000));
app.get('/api/health',(_req,res)=>res.json({success:true,data:{status:'ok',service:'YOU me Backend',version:'2.0.0'},timestamp:new Date().toISOString()}));
app.get('/api/readiness',async(_req,res)=>{try{if(pool)await pool.query('SELECT 1');res.json({success:true,data:{ready:true,database:!!pool}});}catch{res.status(503).json({success:false,data:{ready:false}});}});
app.use('/api/v1/auth',authRoutes); app.use('/api/v1/users',userRoutes); app.use('/api/v1',chartRoutes); app.use('/api/v1/subscription',subscriptionRoutes); app.use('/api/v1/client-errors',clientErrorRoutes); app.use('/api/v1',natalRoutesV1);
app.get('/',(_req,res)=>res.json({success:true,message:'YOU me Backend çalışıyor',version:'2.0.0'}));
app.use((_req,res)=>res.status(404).json({success:false,error:'Endpoint bulunamadı'})); app.use(errorMiddleware);
if(require.main===module){initDatabase().then(()=>app.listen(env.PORT,()=>logger.info({port:env.PORT},'YOU me Backend started'))).catch(err=>{logger.fatal(err,'Startup failed');process.exit(1);});}
