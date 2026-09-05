import { structuredAI } from './ai.service';
export async function generatePersonalReport(context:any){return structuredAI(`report:${JSON.stringify(context).slice(0,5000)}`,`Sen kişiselleştirilmiş astroloji ve Jung farkındalık raporu üreten bir asistansın. Kesin kader iddialarından kaçın.`,JSON.stringify(context));}
