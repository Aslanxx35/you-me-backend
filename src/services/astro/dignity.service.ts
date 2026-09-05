import { DignityResult } from '../../models/astro.models';

const RULERSHIP: Record<string, string[]> = {
  Sun: ['Aslan'], Moon: ['Yengeç'], Mercury: ['İkizler', 'Başak'], Venus: ['Boğa', 'Terazi'],
  Mars: ['Koç', 'Akrep'], Jupiter: ['Yay', 'Balık'], Saturn: ['Oğlak', 'Kova'],
  Uranus: ['Kova'], Neptune: ['Balık'], Pluto: ['Akrep'],
};

const EXALTATION: Record<string, string> = {
  Sun: 'Koç', Moon: 'Boğa', Mercury: 'Başak', Venus: 'Balık', Mars: 'Oğlak',
  Jupiter: 'Yengeç', Saturn: 'Terazi', Uranus: 'Akrep', Neptune: 'Aslan', Pluto: 'Koç',
};

const OPPOSITE_SIGN: Record<string, string> = {
  Koç: 'Terazi', Terazi: 'Koç', Boğa: 'Akrep', Akrep: 'Boğa', İkizler: 'Yay', Yay: 'İkizler',
  Yengeç: 'Oğlak', Oğlak: 'Yengeç', Aslan: 'Kova', Kova: 'Aslan', Başak: 'Balık', Balık: 'Başak',
};

export function getDignity(planet: string, signTR: string): DignityResult {
  const rulerSigns = RULERSHIP[planet] || [];
  const exaltSign = EXALTATION[planet];

  if (rulerSigns.includes(signTR)) return { planet, sign: signTR, dignity: 'Yönetici', score: 5 };
  if (exaltSign === signTR) return { planet, sign: signTR, dignity: 'Yücelme', score: 4 };
  if (rulerSigns.some((r) => OPPOSITE_SIGN[r] === signTR)) return { planet, sign: signTR, dignity: 'Düşkünlük', score: -5 };
  if (exaltSign && OPPOSITE_SIGN[exaltSign] === signTR) return { planet, sign: signTR, dignity: 'Sürgün', score: -4 };
  return { planet, sign: signTR, dignity: 'Nötr', score: 0 };
}

export function getChartDignities(planets: { planet: string; signTR: string }[]): DignityResult[] {
  return planets.map((p) => getDignity(p.planet, p.signTR));
}

const SIGN_TO_MODERN_RULER: Record<string, string> = {
  Koç: 'Mars', Boğa: 'Venus', İkizler: 'Mercury', Yengeç: 'Moon', Aslan: 'Sun', Başak: 'Mercury',
  Terazi: 'Venus', Akrep: 'Pluto', Yay: 'Jupiter', Oğlak: 'Saturn', Kova: 'Uranus', Balık: 'Neptune',
};

export function getRuler(signTR: string): string {
  const ruler = SIGN_TO_MODERN_RULER[signTR];
  if (!ruler) throw new Error(`Bilinmeyen burç: ${signTR}`);
  return ruler;
}
