import { Element, Modality, DominantResult } from '../../models/astro.models';
import { getElementModality } from './elementModality.service';

interface PlanetLike { planet: string; signTR: string; }

const EMPTY_ELEMENTS: Record<Element, number> = { Ateş: 0, Toprak: 0, Hava: 0, Su: 0 };
const EMPTY_MODALITIES: Record<Modality, number> = { Öncü: 0, Sabit: 0, Değişken: 0 };

const WEIGHTS: Record<string, number> = {
  Sun: 2, Moon: 2, Mercury: 2, Venus: 2, Mars: 2,
  Jupiter: 1.5, Saturn: 1.5,
  Uranus: 1, Neptune: 1, Pluto: 1, Chiron: 1, NorthNode: 1,
};

export function getDominant(planets: PlanetLike[]): DominantResult {
  const elementCounts: Record<Element, number> = { ...EMPTY_ELEMENTS };
  const modalityCounts: Record<Modality, number> = { ...EMPTY_MODALITIES };
  const planetWeight: Record<string, number> = {};

  for (const p of planets) {
    const { element, modality } = getElementModality(p.signTR);
    const w = WEIGHTS[p.planet] ?? 1;
    elementCounts[element] += w;
    modalityCounts[modality] += w;
    planetWeight[p.planet] = (planetWeight[p.planet] || 0) + w;
  }

  const dominantElement = (Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as Element) || 'Ateş';
  const dominantModality = (Object.entries(modalityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as Modality) || 'Öncü';
  const dominantPlanet = Object.entries(planetWeight).sort((a, b) => b[1] - a[1])[0]?.[0] || planets[0]?.planet || 'Sun';

  return { dominantElement, elementCounts, dominantModality, modalityCounts, dominantPlanet };
}
