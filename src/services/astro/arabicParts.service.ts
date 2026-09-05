import { ArabicPart } from '../../models/astro.models';
import { lonToSign, findHouse } from '../ephemeris.service';

interface ChartInputs {
  ascendant: number;
  sunLongitude: number;
  moonLongitude: number;
  venusLongitude: number;
  isDayChart: boolean;
  houseCusps: number[];
}

function normalize(lon: number): number {
  return ((lon % 360) + 360) % 360;
}

function buildPart(name: string, nameTR: string, longitude: number, houseCusps: number[]): ArabicPart {
  const lon = normalize(longitude);
  const { sign, signTR } = lonToSign(lon);
  const house = findHouse(lon, houseCusps);
  return { name, nameTR, longitude: lon, sign, signTR, house };
}

export function getArabicParts(inputs: ChartInputs): ArabicPart[] {
  const { ascendant, sunLongitude, moonLongitude, venusLongitude, isDayChart, houseCusps } = inputs;

  const fortuneLon = isDayChart
    ? ascendant + moonLongitude - sunLongitude
    : ascendant + sunLongitude - moonLongitude;

  const spiritLon = isDayChart
    ? ascendant + sunLongitude - moonLongitude
    : ascendant + moonLongitude - sunLongitude;

  const loveLon = ascendant + venusLongitude - sunLongitude;

  return [
    buildPart('Part of Fortune', 'Kısmet Noktası', fortuneLon, houseCusps),
    buildPart('Part of Spirit', 'Ruh Noktası', spiritLon, houseCusps),
    buildPart('Part of Eros', 'Aşk Noktası', loveLon, houseCusps),
  ];
}

export function isDayChart(sunHouse: number): boolean {
  return sunHouse >= 7 && sunHouse <= 12;
}
