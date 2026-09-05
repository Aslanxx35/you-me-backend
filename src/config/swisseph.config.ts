// @ts-ignore - swisseph paketinin resmi TypeScript tipleri yok
import swisseph from 'swisseph';

let initialized = false;

export function initSwissEphemeris(): void {
  if (initialized) return;
  const ephePath = process.env.EPHE_PATH;
  if (ephePath) {
    swisseph.swe_set_ephe_path(ephePath);
  }
  initialized = true;
}

export function isSwissEphemerisReady(): boolean {
  return initialized;
}
