import { isValidWebhookAuth } from '../src/services/revenuecat.service';
test('development webhook can operate without secret',()=>expect(isValidWebhookAuth(undefined)).toBe(true));
