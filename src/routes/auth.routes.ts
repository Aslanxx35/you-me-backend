import { Router } from 'express';
import { authMiddleware } from '../middleware';
import { registerController,loginController,refreshController,logoutController,meController,forgotPasswordController,resetPasswordController } from '../controllers/auth.controller';
const r=Router();
r.post('/register',registerController); r.post('/forgot-password',forgotPasswordController); r.post('/reset-password',resetPasswordController); r.post('/login',loginController); r.post('/refresh',refreshController); r.post('/logout',authMiddleware,logoutController); r.get('/me',authMiddleware,meController); export default r;
