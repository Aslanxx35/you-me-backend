import axios from 'axios';

const BASE = 'https://api.turkiyeapi.dev/v2';

const KKTC_DISTRICTS = ['Lefkoşa', 'Gazimağusa', 'Girne', 'Güzelyurt', 'İskele'];
const KKTC_LABEL = 'KKTC';

let provincesCache: { id: number; name: string }[] | null = null;
let provincesCacheAt = 0;
const districtsCache = new Map<string, string[]>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function getProvinces(): Promise<string[]> {
  const now = Date.now();
  if (!provincesCache || now - provincesCacheAt > CACHE_TTL) {
    const r = await axios.get(`${BASE}/provinces`, { params: { fields: 'id,name', limit: 100 }, timeout: 8000 });
    provincesCache = r.data?.data || [];
    provincesCacheAt = now;
  }
  const names = (provincesCache || []).map((p) => p.name).sort((a, b) => a.localeCompare(b, 'tr'));
  return [...names, KKTC_LABEL];
}

export async function getDistricts(province: string): Promise<string[]> {
  if (province.trim().toLocaleLowerCase('tr-TR') === KKTC_LABEL.toLocaleLowerCase('tr-TR')) {
    return KKTC_DISTRICTS;
  }

  const key = province.trim().toLocaleLowerCase('tr-TR');
  if (districtsCache.has(key)) return districtsCache.get(key)!;

  if (!provincesCache) await getProvinces();
  const match = (provincesCache || []).find((p) => p.name.toLocaleLowerCase('tr-TR') === key);
  if (!match) return [];

  const r = await axios.get(`${BASE}/provinces/${match.id}`, {
    params: { fields: 'id,name', include: 'districts' },
    timeout: 8000,
  });
  const districts: string[] = (r.data?.data?.districts || []).map((d: any) => d.name).sort((a: string, b: string) => a.localeCompare(b, 'tr'));
  districtsCache.set(key, districts);
  return districts;
}
