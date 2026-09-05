export function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function angularDistance(a: number, b: number): number {
  const diff = Math.abs(normalizeDegrees(a) - normalizeDegrees(b));
  return diff > 180 ? 360 - diff : diff;
}

export function degreesToDms(deg: number): { degrees: number; minutes: number; seconds: number } {
  const d = Math.floor(deg);
  const minutesFloat = (deg - d) * 60;
  const m = Math.floor(minutesFloat);
  const s = Math.round((minutesFloat - m) * 60);
  return { degrees: d, minutes: m, seconds: s };
}
