import moment from 'moment-timezone';
import { BirthDataInput, GeoLocation } from '../types/astrology';
import { calculateNatalChart } from './ephemeris.service';

function utcMoment(data:BirthDataInput,loc:GeoLocation){return moment.tz(`${data.date} ${data.time}`,'YYYY-MM-DD HH:mm',loc.timezone).utc();}
export async function calculateDavison(a:BirthDataInput,la:GeoLocation,b:BirthDataInput,lb:GeoLocation){const ma=utcMoment(a,la),mb=utcMoment(b,lb);const midMs=(ma.valueOf()+mb.valueOf())/2;const mid=moment.utc(midMs);const lat=(la.lat+lb.lat)/2;const lon=(la.lon+lb.lon)/2;return calculateNatalChart(mid.format('YYYY-MM-DD'),mid.format('HH:mm'),`Davison ${a.city} + ${b.city}`,lat,lon,0,'Placidus','UTC');}
