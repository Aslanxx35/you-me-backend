import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.config';
describe('auth primitives',()=>{test('access token secret is configured',()=>expect(env.JWT_ACCESS_SECRET.length).toBeGreaterThanOrEqual(32));test('jwt can sign and verify',()=>{const t=jwt.sign({sub:'u',email:'a@b.com',type:'access'},env.JWT_ACCESS_SECRET);expect((jwt.verify(t,env.JWT_ACCESS_SECRET) as any).sub).toBe('u');});});
