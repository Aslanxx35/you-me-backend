import { NatalChartResult, PlanetPosition } from '../types/astrology';
import { computeAspects, lonToSign, angularDistance } from './ephemeris.service';

function midpoint(a:number,b:number){const d=((b-a+540)%360)-180;return ((a+d/2)%360+360)%360;}
export function buildCompositeChart(a:NatalChartResult,b:NatalChartResult){
 const planets:PlanetPosition[]=a.planets.map(pa=>{const pb=b.planets.find(x=>x.planet===pa.planet);const lon=pb?midpoint(pa.longitude,pb.longitude):pa.longitude;const s=lonToSign(lon);return{planet:pa.planet,planetTR:pa.planetTR,longitude:lon,sign:s.sign,signTR:s.signTR,degree:s.degree,degreeFormatted:s.formatted,isRetrograde:pa.isRetrograde,house:findCompositeHouse(lon,a.angles.ASC,b.angles.ASC),speed:((pa.speed||0)+(pb?.speed||0))/2};});
 const aspects=computeAspects(planets); return{type:'composite',planets,houses:[],angles:{ASC:midpoint(a.angles.ASC,b.angles.ASC),MC:midpoint(a.angles.MC,b.angles.MC),IC:midpoint(a.angles.IC,b.angles.IC),DSC:midpoint(a.angles.DSC,b.angles.DSC)},aspects,relationshipPattern:relationshipPattern(aspects)};
}
function findCompositeHouse(lon:number,asc1:number,asc2:number){return Math.floor(angularDistance(lon,midpoint(asc1,asc2))/30)+1;}
function relationshipPattern(aspects:any[]){const positive=aspects.filter(a=>['Trine','Sextile','Conjunction'].includes(a.type)).length;const challenging=aspects.filter(a=>['Square','Opposition'].includes(a.type)).length;return positive>=challenging+2?'Akış ve destek':challenging>=positive+2?'Yoğun dönüşüm ve gerilim':'Denge ve gelişim';}
