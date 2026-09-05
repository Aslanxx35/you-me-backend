import request from 'supertest'; import { app } from '../../src/index';
test('health endpoint is public',async()=>{const r=await request(app).get('/api/health');expect(r.status).toBe(200);expect(r.body.data.status).toBe('ok');});
