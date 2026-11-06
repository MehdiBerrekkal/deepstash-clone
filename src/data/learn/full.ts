/**
 * Full courses (CEFR A1 → B1): topic vocabulary with example sentences, grammar notes with drills, role-play
 * dialogues and short stories. Content is written for this app. Vocabulary is stored as compact text (one word per
 * line: word | English | French | emoji | example | example in English | example in French) and parsed on load.
 */

export type Level = 'A1' | 'A2' | 'B1';
export type Word = { text: string; roman?: string; en: string; fr: string; emoji: string; ex?: string; exEn?: string; exFr?: string };
export type Topic = { id: string; level: Level; icon: string; en: string; fr: string; words: Word[] };

/** A grammar point: cards to tap through, then drills (fill the gap). */
export type Grammar = {
  id: string;
  level: Level;
  icon: string;
  en: string;
  fr: string;
  /** Explanation cards; examples are [target, English, French]. */
  cards: { en: string; fr: string; examples: [string, string, string][] }[];
  /** "Yo ___ estudiante." with the right word and wrong ones. */
  drills: { text: string; answer: string; wrong: string[]; en: string; fr: string }[];
};

/** A role-play: you are B and pick what to say; A's lines are spoken. */
export type Dialogue = {
  id: string;
  level: Level;
  icon: string;
  en: string;
  fr: string;
  lines: { who: 'A' | 'B'; text: string; en: string; fr: string; wrong?: string[] }[];
};

/** A short story: read sentence by sentence, tap words to translate, then answer questions. */
export type Story = {
  id: string;
  level: Level;
  icon: string;
  en: string;
  fr: string;
  sentences: [string, string, string][];
  /** word (lower case) → [English, French] */
  glossary: Record<string, [string, string]>;
  questions: { en: string; fr: string; answer: string; wrong: string[] }[];
};

export type FullCourse = { topics: Topic[]; grammar: Grammar[]; dialogues: Dialogue[]; stories: Story[] };

/** "word|en|fr|emoji|example|exEn|exFr" lines → words. */
export function words(block: string): Word[] {
  return block
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [text, en, fr, emoji, ex, exEn, exFr] = l.split('|').map((x) => x.trim());
      return { text, en, fr, emoji: emoji || '•', ...(ex ? { ex, exEn, exFr } : {}) };
    });
}
