import { ShapeResult, ChartShape } from '../../models/astro.models';

interface PlanetLike { planet: string; longitude: number; }

const SHAPE_DESCRIPTIONS: Record<ChartShape, { tr: string; desc: string }> = {
  Bundle: { tr: 'Demet', desc: 'Tüm gezegenler haritanın 1/3\'ünde (120°) toplanmış — odaklı, tek bir yaşam alanına yoğunlaşan bir enerji.' },
  Bowl: { tr: 'Kase', desc: 'Gezegenler haritanın yarısında (180°) toplanmış — kendi kendine yeten, içe dönük bir bütünlük.' },
  Bucket: { tr: 'Kova', desc: 'Kase şeklinde bir grup + karşı tarafta tek bir "sap" gezegeni — bu gezegen tüm enerjinin dışa aktığı odak noktası.' },
  Locomotive: { tr: 'Lokomotif', desc: 'Gezegenler haritanın 2/3\'ünü (240°) kaplıyor — güçlü, kendi kendini iten bir sürükleyicilik.' },
  Splash: { tr: 'Saçılma', desc: 'Gezegenler haritaya eşit dağılmış — çok yönlü, geniş ilgi alanlı bir yapı.' },
  Splay: { tr: 'Yayılma', desc: 'Gezegenler düzensiz kümeler halinde dağılmış — bağımsız, kalıpların dışına çıkan bir bireysellik.' },
  Seesaw: { tr: 'Tahterevalli', desc: 'Gezegenler iki karşıt gruba ayrılmış — gerilim ve denge arayışı temalı bir yapı.' },
  Wedge: { tr: 'Kama', desc: 'Gezegenler üç kümeye ayrılmış, aralarında belirgin boşluklar var — odaklı ama çok yönlü bir gerilim.' },
};

function angularGaps(longitudes: number[]): number[] {
  const sorted = [...longitudes].sort((a, b) => a - b);
  const gaps: number[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const next = sorted[(i + 1) % sorted.length];
    const gap = i === sorted.length - 1 ? 360 - sorted[i] + next : next - sorted[i];
    gaps.push(gap);
  }
  return gaps;
}

export function getChartShape(planets: PlanetLike[]): ShapeResult {
  const longitudes = planets.map((p) => p.longitude);
  const gaps = angularGaps(longitudes).sort((a, b) => b - a);
  const largestGap = gaps[0] || 0;
  const span = 360 - largestGap;
  const majorGaps = gaps.filter((g) => g >= 60).length;

  let shape: ChartShape;
  if (span <= 120) shape = 'Bundle';
  else if (majorGaps >= 3) shape = 'Splay';
  else if (majorGaps === 2 && span > 240) shape = 'Splash';
  else if (majorGaps === 1) {
    const isolatedCount = gaps.filter((g) => g > 90).length;
    shape = isolatedCount >= 2 ? 'Bucket' : span <= 180 ? 'Bowl' : 'Locomotive';
  } else if (majorGaps === 2) {
    shape = 'Seesaw';
  } else {
    shape = 'Splash';
  }

  const info = SHAPE_DESCRIPTIONS[shape];
  return { shape, shapeTR: info.tr, description: info.desc };
}
