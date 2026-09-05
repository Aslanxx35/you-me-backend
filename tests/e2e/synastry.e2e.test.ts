import request from 'supertest'; import { app } from '../../src/index';
test('synastry endpoint requires authentication',async()=>{const r=await request(app).post('/api/v1/synastry').send({});expect(r.status).toBe(401);});
