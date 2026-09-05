import { Request, Response } from 'express';
import { geocode } from '../services/geocoding.service';
import { calculateNatalChart } from '../services/ephemeris.service';
import { getChartDignities } from '../services/astro/dignity.service';
import { getDominant } from '../services/astro/dominant.service';
import { getChartShape } from '../services/astro/shape.service';
import { getAllDispositorChains } from '../services/astro/dispositor.service';
import { getMoonPhase } from '../services/astro/moonPhase.service';
import { getArabicParts, isDayChart } from '../services/astro/arabicParts.service';
import { natalChartSchema } from '../validators/chart.validator';
import { sendSuccess, sendError } from '../utils/format.util';

export async function getExtendedNatalChart(req: Request, res: Response): Promise<void> {
  const parsed = natalChartSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, parsed.error.errors[0]?.message || 'Geçersiz istek', 400);
    return;
  }
  const { name, date, time, city, houseSystem, lat, lng, utcOffset } = parsed.data;

  try {
    const loc = lat !== undefined && lng !== undefined && utcOffset !== undefined
      ? { lat, lon: lng, utcOffsetMinutes: utcOffset, timezone: 'manual', approximate: false }
      : await geocode(city, date);

    const chart = await calculateNatalChart(date, time, city, loc.lat, loc.lon, loc.utcOffsetMinutes, houseSystem || 'Placidus', loc.timezone);

    const dignities = getChartDignities(chart.planets.map((p) => ({ planet: p.planet, signTR: p.signTR })));
    const dominant = getDominant(chart.planets.map((p) => ({ planet: p.planet, signTR: p.signTR })));
    const shape = getChartShape(chart.planets.map((p) => ({ planet: p.planet, longitude: p.longitude })));
    const dispositors = getAllDispositorChains(chart.planets.map((p) => ({ planet: p.planet, signTR: p.signTR })));

    const sun = chart.planets.find((p) => p.planet === 'Sun');
    const moon = chart.planets.find((p) => p.planet === 'Moon');
    const venus = chart.planets.find((p) => p.planet === 'Venus');
    const moonPhase = sun && moon ? getMoonPhase(sun.longitude, moon.longitude) : null;

    let arabicParts: ReturnType<typeof getArabicParts> = [];
    if (sun && moon && venus && sun.house) {
      arabicParts = getArabicParts({
        ascendant: chart.angles.ASC,
        sunLongitude: sun.longitude,
        moonLongitude: moon.longitude,
        venusLongitude: venus.longitude,
        isDayChart: isDayChart(sun.house),
        houseCusps: chart.houses.map((h) => h.longitude),
      });
    }

    sendSuccess(res, {
      name,
      ...chart,
      dignities,
      dominant,
      shape,
      dispositors,
      moonPhase,
      arabicParts,
      locationMeta: {
        approximate: Boolean((loc as any).approximate),
        timezone: loc.timezone,
      },
    });
  } catch (e: any) {
    sendError(res, e.message);
  }
}
