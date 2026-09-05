import request from 'supertest'; import { app } from '../../src/index';
test('protected endpoint rejects anonymous request',async()=>{const r=await request(app).get('/api/v1/me/birth-data');expect(r.status).toBe(401);});
