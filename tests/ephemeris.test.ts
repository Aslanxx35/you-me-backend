import { calculateNatalChart, findHouse, angularDistance } from '../src/services/ephemeris.service';

describe('Swiss Ephemeris regression', () => {
  test('calculates a natal chart', async () => {
    const c = await calculateNatalChart('1990-01-01', '12:00', 'Izmir', 38.423, 27.142, 120, 'Placidus', 'Europe/Istanbul');
    expect(c.planets.length).toBeGreaterThanOrEqual(10);
    expect(c.houses).toHaveLength(12);
    expect(c.calculationMeta).toBeDefined();
  });
  // ... rest of tests
}, 30000);
