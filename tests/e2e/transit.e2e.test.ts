import request from 'supertest'; import { app } from '../../src/index';
test('transit endpoint requires authentication',async()=>{const r=await request(app).post('/api/v1/transit').send({});expect(r.status).toBe(401);});
