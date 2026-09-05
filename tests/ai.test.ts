import { generateDailyReading } from '../src/services/daily.service';
test('daily AI has deterministic fallback shape',async()=>{const r=await generateDailyReading('Koç','2026-08-02');expect(r.sign).toBe('Koç');expect(r.reading).toBeTruthy();});
