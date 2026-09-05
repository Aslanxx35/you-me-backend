import { DispositorChain } from '../../models/astro.models';
import { getRuler } from './dignity.service';

interface PlanetLike { planet: string; signTR: string; }
const MAX_CHAIN_LENGTH = 10;

export function getDispositorChain(planet: string, planets: PlanetLike[]): DispositorChain {
  const bySign = new Map(planets.map((p) => [p.planet, p.signTR]));
  const chain: string[] = [];
  let current = planet;

  for (let i = 0; i < MAX_CHAIN_LENGTH; i++) {
    const sign = bySign.get(current);
    if (!sign) break;
    const ruler = getRuler(sign);
    chain.push(ruler);

    if (ruler === current) return { planet, chain, isFinal: true, finalDispositor: ruler };
    if (chain.slice(0, -1).includes(ruler)) return { planet, chain, isFinal: true, finalDispositor: ruler };
    current = ruler;
  }

  return { planet, chain, isFinal: false, finalDispositor: null };
}

export function getAllDispositorChains(planets: PlanetLike[]): DispositorChain[] {
  return planets.map((p) => getDispositorChain(p.planet, planets));
}
