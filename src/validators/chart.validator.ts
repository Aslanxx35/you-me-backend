import { z } from 'zod';
import moment from 'moment-timezone';
function dateField(label='date'){return z.string().refine(v=>moment(v,'YYYY-MM-DD',true).isValid(),`${label}, YYYY-MM-DD formatında olmalı`);}
const timeField=z.string().refine(v=>moment(v,'HH:mm',true).isValid(),'time, HH:MM formatında olmalı');
const birth=z.object({date:dateField(),time:timeField,city:z.string().trim().min(2).max(200)}).superRefine((v,ctx)=>{const m=moment(`${v.date} ${v.time}`,'YYYY-MM-DD HH:mm',true);if(!m.isValid())ctx.addIssue({code:'custom',path:['date'],message:'Geçersiz tarih/saat'});else if(m.isAfter(moment()))ctx.addIssue({code:'custom',path:['date'],message:'Gelecek tarih kabul edilmez'});});
export const natalChartSchema=z.object({name:z.string().trim().max(100).optional(),date:dateField(),time:timeField,city:z.string().trim().min(2).max(200),houseSystem:z.enum(['Placidus','Koch','Whole Sign','Equal']).optional(),lat:z.number().min(-90).max(90).optional(),lng:z.number().min(-180).max(180).optional(),utcOffset:z.number().min(-840).max(840).optional()}).superRefine((v,ctx)=>{const m=moment(`${v.date} ${v.time}`,'YYYY-MM-DD HH:mm',true);if(!m.isValid())ctx.addIssue({code:'custom',path:['date'],message:'Geçersiz tarih/saat'});else if(m.isAfter(moment()))ctx.addIssue({code:'custom',path:['date'],message:'Gelecek tarih kabul edilmez'});if((v.lat===undefined)!==(v.lng===undefined)||(v.lng===undefined)!==(v.utcOffset===undefined))ctx.addIssue({code:'custom',path:['lat'],message:'lat, lng ve utcOffset birlikte verilmelidir'});});
const transitDate=dateField('transitDate');
export const transitSchema=z.object({birthData:birth,transitDate:transitDate.optional()});
export const synastrySchema=z.object({person1:birth,person2:birth,includeComposite:z.boolean().optional()});
export const dailyReadingSchema=z.object({sign:z.string().trim().min(2).max(30),date:dateField().optional()});
