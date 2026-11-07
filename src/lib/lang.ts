import type { ReaderSettings } from '@/lib/types';

/** Languages the app reads aloud in. */
export type SpeechLang = 'en' | 'fr';

// Short, frequent words that tell French from English apart.
const FR_WORDS = new Set(['le', 'la', 'les', 'des', 'du', 'une', 'est', 'et', 'que', 'qui', 'dans', 'pour', 'pas', 'sur', 'au', 'aux', 'avec', 'ce', 'cette', 'son', 'sa', 'ses', 'sont', 'nous', 'vous', 'il', 'elle', 'ils', 'mais', 'ou', 'où', 'plus', 'comme', 'quel', 'quelle', 'qu', 'un', 'en', 'de', 'ne', 'se', 'leur', 'été', 'être', 'fait', 'très', 'je', 'tu', 'donc', 'suis', 'mon', 'ma', 'mes', 'ton', 'moi', 'toi', 'lui', 'à', 'chez', 'sans', 'aussi', 'bien', 'tout', 'rien', 'notre', 'votre', 'peut', 'faut', 'quand']);
const EN_WORDS = new Set(['the', 'and', 'of', 'to', 'is', 'in', 'that', 'it', 'for', 'was', 'with', 'as', 'on', 'are', 'be', 'by', 'this', 'which', 'what', 'who', 'you', 'not', 'from', 'at', 'or', 'his', 'her', 'they', 'have', 'has', 'an', 'its', 'were', 'their', 'how', 'does', 'did']);

/** Guesses whether a short text is French or English (word counts, plus accents as a tie-breaker). */
export function detectLang(text: string): SpeechLang {
  const words = text.toLowerCase().split(/[^a-zàâäçéèêëîïôöùûüÿœæ]+/).filter(Boolean);
  let fr = 0;
  let en = 0;
  for (const w of words) {
    if (FR_WORDS.has(w)) fr++;
    if (EN_WORDS.has(w)) en++;
  }
  // "d'avril", "l'homme": elisions are a strong French sign.
  fr += (text.match(/\b[dlqjnmst]['’][a-zàâéèêîôû]/gi) ?? []).length;
  if (fr === en) return /[àâçéèêëîïôûœ]/i.test(text) ? 'fr' : 'en';
  return fr > en ? 'fr' : 'en';
}

/** Whether a stored voice id belongs to French ("piper:fr_FR-…", or a system voice like "…fr-FR…"). */
export const isFrenchVoice = (voice?: string) => !!voice && /(^piper:fr_|\bfr[-_][A-Z]{2}\b|fr-fr|fr_fr)/i.test(voice);

/**
 * The voice chosen for a language. French has its own setting; older saves kept a French choice in `voice`,
 * so that's honoured too, and never used for English.
 */
export function voiceForLanguage(settings: Pick<ReaderSettings, 'voice' | 'voiceFr'>, language: string): string | undefined {
  if (language.startsWith('fr')) return settings.voiceFr ?? (isFrenchVoice(settings.voice) ? settings.voice : undefined);
  return isFrenchVoice(settings.voice) ? undefined : settings.voice;
}

/** The settings change that picks a voice for a language. */
export const voiceSetting = (language: string, voice: string | undefined): Partial<ReaderSettings> =>
  language.startsWith('fr') ? { voiceFr: voice } : { voice };
