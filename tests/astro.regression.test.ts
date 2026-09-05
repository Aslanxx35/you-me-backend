import { getMoonPhase } from '../src/services/astro/moonPhase.service';
import { compatibilityScore } from '../src/services/scoring.service';
import { angularDistance, findHouse, lonToSign } from '../src/services/ephemeris.service';

describe('astro regression',()=>{
 test('180 degrees is full moon',()=>expect(getMoonPhase(0,180).phase).toBe('Dolunay'));
 test('0 degrees is new moon',()=>expect(getMoonPhase(10,10).phase).toBe('Yeni Ay'));
 test('45 degrees is crescent',()=>expect(getMoonPhase(0,45).phase).toBe('Hilal'));
 test('date-independent angular distance wraps',()=>expect(angularDistance(359,1)).toBe(2));
 test('sign conversion',()=>expect(lonToSign(30).sign).toBe('Taurus'));
 test('house wrapping',()=>expect(findHouse(359,[350,20,50,80,110,140,170,200,230,260,290,320])).toBe(1));
 test('scoring is deterministic',()=>{const a=[{planet1:'Sun',planet2:'Moon',type:'Trine',orb:0.5}];expect(compatibilityScore(a)).toBe(57.31);expect(compatibilityScore(a)).toBe(57.31);});
});
