import axios from 'axios';
import moment from 'moment-timezone';
import tzlookup from 'tz-lookup';
import { GeoLocation } from '../types/astrology';
import { TtlCache, CACHE_TTL } from '../config/cache.config';

const CITY_MAP: Record<string,{lat:number;lon:number;tz:string;country:string}>={
  istanbul:{lat:41.015,lon:28.979,tz:'Europe/Istanbul',country:'Türkiye'}, ankara:{lat:39.925,lon:32.866,tz:'Europe/Istanbul',country:'Türkiye'}, izmir:{lat:38.423,lon:27.142,tz:'Europe/Istanbul',country:'Türkiye'},
  london:{lat:51.507,lon:-0.127,tz:'Europe/London',country:'United Kingdom'}, paris:{lat:48.856,lon:2.352,tz:'Europe/Paris',country:'France'}, berlin:{lat:52.52,lon:13.405,tz:'Europe/Berlin',country:'Germany'},
  'new york':{lat:40.7128,lon:-74.006,tz:'America/New_York',country:'USA'}, 'los angeles':{lat:34.0522,lon:-118.2437,tz:'America/Los_Angeles',country:'USA'}, chicago:{lat:41.8781,lon:-87.6298,tz:'America/Chicago',country:'USA'}
};
const cache=new TtlCache<GeoLocation>(CACHE_TTL.GEOCODING_MS);
export function resolveUtcOffset(timezone:string,date?:string,time='12:00'){const m=moment.tz(`${date||moment().format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm', timezone);return m.utcOffset();}
function timezoneForCoordinates(lat:number,lon:number){try{return tzlookup(lat,lon);}catch{return 'UTC';}}
export async function geocode(city:string,date?:string,time='12:00'):Promise<GeoLocation>{
 const key=`${city.toLowerCase()}|${date||''}|${time}`; const cached=cache.get(key); if(cached)return cached;
 const staticLoc=CITY_MAP[city.trim().toLowerCase()];
 if(staticLoc){const loc={...staticLoc,city,country:staticLoc.country,timezone:staticLoc.tz,utcOffsetMinutes:resolveUtcOffset(staticLoc.tz,date,time)};cache.set(key,loc);return loc;}
 try{const r=await axios.get('https://nominatim.openstreetmap.org/search',{params:{q:city,format:'json',limit:1,addressdetails:1},headers:{'User-Agent':'you-me-backend/2.0','Accept-Language':'tr,en'},timeout:5000}); if(r.data?.length){const x=r.data[0],lat=Number(x.lat),lon=Number(x.lon),timezone=timezoneForCoordinates(lat,lon);const loc:GeoLocation={lat,lon,timezone,utcOffsetMinutes:resolveUtcOffset(timezone,date,time),city:x.display_name?.split(',')[0]||city,country:x.address?.country||'',approximate:false};cache.set(key,loc);return loc;}}
 catch {}
 const fallback={lat:38.423,lon:27.142,timezone:'Europe/Istanbul',utcOffsetMinutes:resolveUtcOffset('Europe/Istanbul',date,time),city,country:'Türkiye',approximate:true}; cache.set(key,fallback); return fallback;
}
const KKTC_COORDS:Record<string,{lat:number;lon:number}>={lefkoşa:{lat:35.1856,lon:33.3823},gazimağusa:{lat:35.1264,lon:33.9391},girne:{lat:35.3414,lon:33.3152},güzelyurt:{lat:35.2,lon:32.9939},i̇skele:{lat:35.2867,lon:33.8919}};
export async function geocodeDistrict(il:string,ilce:string,date?:string,time='12:00'){const isKktc=il.trim().toLocaleLowerCase('tr-TR')==='kktc';const key=`district|${il}|${ilce}|${date}|${time}`;const c=cache.get(key);if(c)return c;if(isKktc){const p=KKTC_COORDS[ilce.trim().toLocaleLowerCase('tr-TR')];if(p){const loc={...p,timezone:'Europe/Istanbul',utcOffsetMinutes:resolveUtcOffset('Europe/Istanbul',date,time),city:ilce,country:'KKTC'};cache.set(key,loc);return loc;}}
 try{const q=isKktc?`${ilce}, Kuzey Kıbrıs`:`${ilce}, ${il}, Türkiye`;const r=await axios.get('https://nominatim.openstreetmap.org/search',{params:{q,format:'json',limit:1,addressdetails:1},headers:{'User-Agent':'you-me-backend/2.0'},timeout:5000});if(r.data?.length){const x=r.data[0],lat=Number(x.lat),lon=Number(x.lon),timezone=timezoneForCoordinates(lat,lon);const loc={lat,lon,timezone,utcOffsetMinutes:resolveUtcOffset(timezone,date,time),city:ilce,country:x.address?.country||(isKktc?'KKTC':'Türkiye')};cache.set(key,loc);return loc;}}catch{}
 const province=await geocode(il,date,time);return {...province,city:ilce,approximate:true};}
