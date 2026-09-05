import { calculateNatalChart, getPlanetPositionsAtJulianDay, lonToSign, angularDistance, toJulianDay, ASPECT_DEFINITIONS, findHouse } from './ephemeris.service';
import { TransitAspect, TransitResult } from '../types/astrology';
import { GeoLocation } from '../types/astrology';

const ORB_WEIGHT:Record<string,number>={Sun:1.25,Moon:1.2,Mercury:1,Venus:1.1,Mars:1.1,Jupiter:1.05,Saturn:1.1,Uranus:1,Neptune:1,Pluto:1.1,NorthNode:.9,Chiron:.8};
function effectiveOrb(tp:string,np:string,base:number){return Math.min(10,base*((ORB_WEIGHT[tp]||1)+(ORB_WEIGHT[np]||1))/2);}
function phase(lon1:number,lon2:number,angle:number,speed1:number,speed2:number):'applying'|'separating'|'exact'{const d=angularDistance(lon1,lon2);if(Math.abs(d-angle)<0.05)return'exact';const current=Math.abs(d-angle);const future=Math.abs(angularDistance(lon1+speed1*0.01,lon2+speed2*0.01)-angle);return future<current?'applying':'separating';}
export async function calculateTransitEngine(natalDate:string,natalTime:string,natalCity:string,natalLoc:GeoLocation,transitDate:string,transitTime='12:00',houseSystem='Placidus',transitLoc:GeoLocation=natalLoc):Promise<TransitResult>{
 const natal=await calculateNatalChart(natalDate,natalTime,natalCity,natalLoc.lat,natalLoc.lon,natalLoc.utcOffsetMinutes,houseSystem,natalLoc.timezone);
 const tJd=toJulianDay(transitDate,transitTime,transitLoc.utcOffsetMinutes); const raw=await getPlanetPositionsAtJulianDay(tJd); const transitPlanets=raw.map(p=>{const s=lonToSign(p.longitude);return{planet:p.name,planetTR:p.name,longitude:p.longitude,sign:s.sign,signTR:s.signTR,degree:s.degree,degreeFormatted:s.formatted,isRetrograde:p.speed<0,house:1,speed:p.speed};});
 const houseChart=await calculateNatalChart(transitDate,transitTime,natalCity,transitLoc.lat,transitLoc.lon,transitLoc.utcOffsetMinutes,houseSystem,transitLoc.timezone); for(const p of transitPlanets)p.house=findHouse(p.longitude,houseChart.houses.map(h=>h.longitude));
 const aspects:TransitAspect[]=[]; for(const tp of transitPlanets)for(const np of natal.planets){for(const a of ASPECT_DEFINITIONS){const d=angularDistance(tp.longitude,np.longitude),orb=Math.abs(d-a.angle),max=effectiveOrb(tp.planet,np.planet,a.orb);if(orb<=max){aspects.push({transitPlanet:tp.planet,natalPlanet:np.planet,type:a.type,typeTR:a.nameTR,angle:a.angle,orb:Number(orb.toFixed(3)),phase:phase(tp.longitude,np.longitude,a.angle,tp.speed||0,np.speed||0),transitHouse:tp.house,natalHouse:np.house});break;}}}
 return{date:transitDate,time:transitTime,transitPlanets,natalPlanets:natal.planets,transitHouses:houseChart.houses,transitAngles:houseChart.angles,aspects,calculationMeta:houseChart.calculationMeta};
}
