import axios from 'axios';
import { env } from '../config/env.config';
import { TtlCache, CACHE_TTL } from '../config/cache.config';
const cache = new TtlCache<AIReading>(CACHE_TTL.DAILY_READING_MS);
export interface AIReading { title:string; summary:string; themes:string[]; advice:string[]; disclaimer:string; }
const fallback:AIReading={title:'Kişisel gökyüzü rehberi',summary:'Bugün kendini gözlemlemek ve kararlarını bilinçli vermek için alan aç.',themes:['farkındalık','denge','niyet'],advice:['Acele karar vermeden önce kısa bir duraklama yap.','Duygularını bastırmak yerine adlandır.'],disclaimer:'Bu içerik eğlence ve kişisel farkındalık amaçlıdır; profesyonel tavsiye değildir.'};
export async function structuredAI(key:string,system:string,user:string):Promise<AIReading>{
 const cached=cache.get(key); if(cached)return cached; if(!env.OPENAI_API_KEY)return fallback;
 try{
  const schema={type:'object',properties:{title:{type:'string'},summary:{type:'string'},themes:{type:'array',items:{type:'string'}},advice:{type:'array',items:{type:'string'}},disclaimer:{type:'string'}},required:['title','summary','themes','advice','disclaimer'],additionalProperties:false};
  const payload={model:env.OPENAI_MODEL,messages:[{role:'system',content:system},{role:'user',content:user}],temperature:.7,response_format:{type:'json_schema',json_schema:{name:'astro_reading',strict:true,schema}}};
  const r=await axios.post('https://api.openai.com/v1/chat/completions',payload,{headers:{Authorization:`Bearer ${env.OPENAI_API_KEY}`,'Content-Type':'application/json'},timeout:15000});
  const raw=r.data?.choices?.[0]?.message?.content; if(!raw) return fallback; const data=JSON.parse(raw) as AIReading; cache.set(key,data); return data;
 }catch{return fallback;}
}
export function clearAICache(){cache.clear();}
