import { Element, Modality, Polarity, ElementModalityResult } from '../../models/astro.models';

const SIGNS_TR = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
const ELEMENTS: Element[] = ['Ateş', 'Toprak', 'Hava', 'Su', 'Ateş', 'Toprak', 'Hava', 'Su', 'Ateş', 'Toprak', 'Hava', 'Su'];
const MODALITIES: Modality[] = ['Öncü', 'Sabit', 'Değişken', 'Öncü', 'Sabit', 'Değişken', 'Öncü', 'Sabit', 'Değişken', 'Öncü', 'Sabit', 'Değişken'];
const POLARITIES: Polarity[] = ['Pozitif', 'Negatif', 'Pozitif', 'Negatif', 'Pozitif', 'Negatif', 'Pozitif', 'Negatif', 'Pozitif', 'Negatif', 'Pozitif', 'Negatif'];

export function getElementModality(signTR: string): ElementModalityResult {
  const i = SIGNS_TR.indexOf(signTR);
  if (i === -1) throw new Error(`Bilinmeyen burç: ${signTR}`);
  return { sign: signTR, element: ELEMENTS[i], modality: MODALITIES[i], polarity: POLARITIES[i] };
}

export function getElementModalityByIndex(signIndex: number): ElementModalityResult {
  const i = ((signIndex % 12) + 12) % 12;
  return { sign: SIGNS_TR[i], element: ELEMENTS[i], modality: MODALITIES[i], polarity: POLARITIES[i] };
}
