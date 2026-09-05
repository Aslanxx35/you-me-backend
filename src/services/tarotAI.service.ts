import { TarotCard } from './tarotService';
import { structuredAI } from './ai.service';
export async function generateTarotAI(card:TarotCard,sign:string,archetype?:string){return structuredAI(`tarot:${card.id}:${sign}:${archetype||''}`,`Sen astroloji ve Jung temalarını kullanan bir tarot yorumcususun. Kehanet iddiasında bulunma; sembolik ve kişisel farkındalık odaklı ol.`,`Kart: ${card.nameTR}. Astrolojik eşleşme: ${card.astrologyTR}. Element: ${card.element}. Anahtar kelimeler: ${card.keywords.join(', ')}. Kullanıcı burcu: ${sign}. Arketip: ${archetype||'belirtilmedi'}.`);}
