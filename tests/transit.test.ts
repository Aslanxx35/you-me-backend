import { calculateTransitEngine } from '../src/services/transit.service';
import { geocode } from '../src/services/geocoding.service';

describe('transit engine',()=>{
 test('calculates transit planets, houses and aspect metadata',async()=>{const loc=await geocode('Izmir','1990-01-01','12:00');const r=await calculateTransitEngine('1990-01-01','12:00','Izmir',loc,'2026-08-02','12:00');expect(r.transitPlanets.length).toBeGreaterThan(5);expect(r.transitHouses).toHaveLength(12);expect(r.transitAngles.ASC).toBeGreaterThanOrEqual(0);for(const a of r.aspects)expect(['applying','separating','exact']).toContain(a.phase);},30000);
});
