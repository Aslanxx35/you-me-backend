import { structuredAI } from './ai.service';
export async function generateDailyReading(sign:string,date:string){const r=await structuredAI(`daily:${sign}:${date}`,`Sen deneyimli bir astrologsun. Türkçe, sembolik ve gerçekçi günlük burç içeriği üret. Kader garantisi verme.`,`${sign} burcu için ${date} tarihli günlük yorum.`);return{sign,date,reading:r.summary,mood:r.themes[0]||'Dengeli',luckyNumber:(Math.abs(hash(sign+date))%9)+1,structured:r};}
function hash(s:string){let h=0;for(const c of s)h=(h<<5)-h+c.charCodeAt(0)|0;return h;}
