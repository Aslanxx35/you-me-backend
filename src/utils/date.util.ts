import moment from 'moment-timezone';
export function isValidIsoDate(value:string):boolean{return moment(value,'YYYY-MM-DD',true).isValid();}
export function isValidTime(value:string):boolean{return moment(value,'HH:mm',true).isValid();}
export function assertPastDate(date:string,time?:string){if(!isValidIsoDate(date))throw new Error('Geçersiz tarih'); if(time&&!isValidTime(time))throw new Error('Geçersiz saat'); const candidate=moment(`${date} ${time||'23:59'}`,'YYYY-MM-DD HH:mm',true); if(candidate.isAfter(moment())) throw new Error('Gelecek tarih kabul edilmez');}
