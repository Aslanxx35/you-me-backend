import axios from 'axios';

export interface TarotCard {
  id: number;
  name: string;
  nameTR: string;
  arcana: 'Major' | 'Minor';
  suit?: 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
  suitTR?: string;
  rank?: string;
  element: string;
  astrology: string;
  astrologyTR: string;
  keywords: string[];
}

const MAJOR_ARCANA: TarotCard[] = [
  { id: 0, name: 'The Fool', nameTR: 'Deli', arcana: 'Major', element: 'Hava', astrology: 'Uranus', astrologyTR: 'Uranüs', keywords: ['Yeni başlangıç', 'Özgürlük', 'Risk'] },
  { id: 1, name: 'The Magician', nameTR: 'Büyücü', arcana: 'Major', element: 'Hava/Ateş', astrology: 'Mercury', astrologyTR: 'Merkür', keywords: ['İrade', 'Yaratma gücü', 'Beceri'] },
  { id: 2, name: 'The High Priestess', nameTR: 'Azize', arcana: 'Major', element: 'Su', astrology: 'Moon', astrologyTR: 'Ay', keywords: ['Sezgi', 'Gizem', 'İç ses'] },
  { id: 3, name: 'The Empress', nameTR: 'İmparatoriçe', arcana: 'Major', element: 'Toprak', astrology: 'Venus', astrologyTR: 'Venüs', keywords: ['Bereket', 'Yaratıcılık', 'Şefkat'] },
  { id: 4, name: 'The Emperor', nameTR: 'İmparator', arcana: 'Major', element: 'Ateş', astrology: 'Aries', astrologyTR: 'Koç', keywords: ['Otorite', 'Yapı', 'Kontrol'] },
  { id: 5, name: 'The Hierophant', nameTR: 'Aziz', arcana: 'Major', element: 'Toprak', astrology: 'Taurus', astrologyTR: 'Boğa', keywords: ['Gelenek', 'Öğreti', 'İnanç'] },
  { id: 6, name: 'The Lovers', nameTR: 'Aşıklar', arcana: 'Major', element: 'Hava', astrology: 'Gemini', astrologyTR: 'İkizler', keywords: ['Seçim', 'Uyum', 'Bağlantı'] },
  { id: 7, name: 'The Chariot', nameTR: 'Savaş Arabası', arcana: 'Major', element: 'Su', astrology: 'Cancer', astrologyTR: 'Yengeç', keywords: ['İrade', 'Zafer', 'Yön'] },
  { id: 8, name: 'Strength', nameTR: 'Güç', arcana: 'Major', element: 'Ateş', astrology: 'Leo', astrologyTR: 'Aslan', keywords: ['Cesaret', 'İç güç', 'Sabır'] },
  { id: 9, name: 'The Hermit', nameTR: 'Ermiş', arcana: 'Major', element: 'Toprak', astrology: 'Virgo', astrologyTR: 'Başak', keywords: ['İçe dönüş', 'Bilgelik', 'Yalnızlık'] },
  { id: 10, name: 'Wheel of Fortune', nameTR: 'Kader Çarkı', arcana: 'Major', element: 'Ateş', astrology: 'Jupiter', astrologyTR: 'Jüpiter', keywords: ['Döngü', 'Şans', 'Değişim'] },
  { id: 11, name: 'Justice', nameTR: 'Adalet', arcana: 'Major', element: 'Hava', astrology: 'Libra', astrologyTR: 'Terazi', keywords: ['Denge', 'Gerçek', 'Sonuç'] },
  { id: 12, name: 'The Hanged Man', nameTR: 'Asılan Adam', arcana: 'Major', element: 'Su', astrology: 'Neptune', astrologyTR: 'Neptün', keywords: ['Teslimiyet', 'Bakış açısı', 'Bekleyiş'] },
  { id: 13, name: 'Death', nameTR: 'Ölüm', arcana: 'Major', element: 'Su', astrology: 'Scorpio', astrologyTR: 'Akrep', keywords: ['Dönüşüm', 'Bitiş', 'Yeniden doğuş'] },
  { id: 14, name: 'Temperance', nameTR: 'Denge', arcana: 'Major', element: 'Ateş', astrology: 'Sagittarius', astrologyTR: 'Yay', keywords: ['Uyum', 'Sabır', 'Orta yol'] },
  { id: 15, name: 'The Devil', nameTR: 'Şeytan', arcana: 'Major', element: 'Toprak', astrology: 'Capricorn', astrologyTR: 'Oğlak', keywords: ['Bağımlılık', 'Gölge', 'Maddi dünya'] },
  { id: 16, name: 'The Tower', nameTR: 'Kule', arcana: 'Major', element: 'Ateş', astrology: 'Mars', astrologyTR: 'Mars', keywords: ['Ani değişim', 'Yıkım', 'Uyanış'] },
  { id: 17, name: 'The Star', nameTR: 'Yıldız', arcana: 'Major', element: 'Hava', astrology: 'Aquarius', astrologyTR: 'Kova', keywords: ['Umut', 'İlham', 'Şifa'] },
  { id: 18, name: 'The Moon', nameTR: 'Ay', arcana: 'Major', element: 'Su', astrology: 'Pisces', astrologyTR: 'Balık', keywords: ['Belirsizlik', 'Bilinçaltı', 'Rüya'] },
  { id: 19, name: 'The Sun', nameTR: 'Güneş', arcana: 'Major', element: 'Ateş', astrology: 'Sun', astrologyTR: 'Güneş', keywords: ['Neşe', 'Başarı', 'Aydınlanma'] },
  { id: 20, name: 'Judgement', nameTR: 'Mahkeme', arcana: 'Major', element: 'Ateş', astrology: 'Pluto', astrologyTR: 'Plüton', keywords: ['Uyanış', 'Hesaplaşma', 'Yenilenme'] },
  { id: 21, name: 'The World', nameTR: 'Dünya', arcana: 'Major', element: 'Toprak', astrology: 'Saturn', astrologyTR: 'Satürn', keywords: ['Tamamlanma', 'Bütünlük', 'Başarı'] },
];

const SUITS: { name: 'Wands' | 'Cups' | 'Swords' | 'Pentacles'; nameTR: string; element: string; signs: string[] }[] = [
  { name: 'Wands', nameTR: 'Değnekler', element: 'Ateş', signs: ['Koç', 'Aslan', 'Yay'] },
  { name: 'Cups', nameTR: 'Kupalar', element: 'Su', signs: ['Yengeç', 'Akrep', 'Balık'] },
  { name: 'Swords', nameTR: 'Kılıçlar', element: 'Hava', signs: ['İkizler', 'Terazi', 'Kova'] },
  { name: 'Pentacles', nameTR: 'Tılsımlar', element: 'Toprak', signs: ['Boğa', 'Başak', 'Oğlak'] },
];

const RANKS = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Page', 'Knight', 'Queen', 'King'];
const RANKS_TR = ['As', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Uşak', 'Şövalye', 'Kraliçe', 'Kral'];
const RANK_KEYWORDS: Record<string, string[]> = {
  Ace: ['Yeni başlangıç', 'Potansiyel'],
  '2': ['Denge', 'Seçim'],
  '3': ['Büyüme', 'İşbirliği'],
  '4': ['Kararlılık', 'Temel'],
  '5': ['Çatışma', 'Değişim'],
  '6': ['Uyum', 'İyileşme'],
  '7': ['Değerlendirme', 'Sabır'],
  '8': ['Hareket', 'Odak'],
  '9': ['Olgunluk', 'Dayanıklılık'],
  '10': ['Tamamlanma', 'Sonuç'],
  Page: ['Merak', 'Öğrenme'],
  Knight: ['Eylem', 'Tutku'],
  Queen: ['Sezgi', 'Besleyicilik'],
  King: ['Ustalık', 'Otorite'],
};

function buildMinorArcana(): TarotCard[] {
  const cards: TarotCard[] = [];
  let id = 22;
  for (const suit of SUITS) {
    RANKS.forEach((rank, i) => {
      cards.push({
        id: id++,
        name: `${rank} of ${suit.name}`,
        nameTR: `${suit.nameTR} ${RANKS_TR[i]}`,
        arcana: 'Minor',
        suit: suit.name,
        suitTR: suit.nameTR,
        rank,
        element: suit.element,
        astrology: suit.signs[i % suit.signs.length],
        astrologyTR: suit.signs[i % suit.signs.length],
        keywords: RANK_KEYWORDS[rank],
      });
    });
  }
  return cards;
}

export const TAROT_DECK: TarotCard[] = [...MAJOR_ARCANA, ...buildMinorArcana()];

export function drawCard(userSigns?: { sun?: string; moon?: string; ascendant?: string }, seed?: string): TarotCard {
  if (userSigns) {
    const matches = TAROT_DECK.filter(
      (c) => c.astrologyTR === userSigns.sun || c.astrologyTR === userSigns.moon || c.astrologyTR === userSigns.ascendant
    );
    if (matches.length && Math.random() < 0.4) {
      return matches[Math.floor(Math.random() * matches.length)];
    }
  }
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i);
    return TAROT_DECK[Math.abs(hash) % TAROT_DECK.length];
  }
  return TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
}

export async function generateTarotInterpretation(card: TarotCard, sign?: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const fallback = `${card.nameTR}, ${card.keywords.join(', ').toLocaleLowerCase('tr-TR')} temalarını taşıyor. Bugün bu enerjiyle hareket etmen, sana yeni bir bakış açısı kazandırabilir. ${card.astrologyTR} etkisini içinde hissedebilirsin — bu kartın sana hatırlattığı şey, an içinde kalmak.`;

  if (!apiKey) return fallback;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Sen deneyimli bir tarot yorumcususun. Türkçe, 3 kısa paragraflık, astrolojiyle harmanlanmış, sıcak ama gerçekçi yorumlar yazıyorsun.' },
          { role: 'user', content: `Kart: ${card.nameTR} (${card.astrologyTR} etkisi, anahtar kelimeler: ${card.keywords.join(', ')}). Kullanıcının burcu: ${sign || 'bilinmiyor'}. 3 paragraflık bir yorum yaz.` },
        ],
        max_tokens: 350,
        temperature: 0.85,
      },
      { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, timeout: 15000 }
    );
    return response.data?.choices?.[0]?.message?.content?.trim() || fallback;
  } catch {
    return fallback;
  }
}
