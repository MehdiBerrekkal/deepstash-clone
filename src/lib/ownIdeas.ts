import type { FullBook } from '@/lib/fullbook';
import { detectLang } from '@/lib/lang';

/**
 * Main-idea cards for a book the user opened from their own device, worked out on the device itself (no
 * server, no AI service): the book is split into parts (its chapters when it has them), and in each part the
 * sentences that carry its most important words are picked and joined into one card. Each card is titled by the
 * chapter, or by the words that part is most about. The cards stay private, like the book.
 */
export type OwnIdea = { title: string; body: string };

export type OwnIdeasResult = {
  ideas: OwnIdea[];
  /** A short blurb for the book's page. */
  description: string;
  topicId: string;
  lang: 'en' | 'fr';
  /** For each card, a longer set of the part's key passages, for an AI to summarise (see bookAi.ts). */
  passages: { title?: string; text: string }[];
};

/** Bumped when the method changes, so older books get their ideas made again. */
export const OWN_IDEAS_VERSION = 1;

const MAX_IDEAS = 12;
const MIN_IDEAS = 5;
const MIN_WORDS = 45;
const MAX_WORDS = 120;
const PASSAGE_WORDS = 700;

const STOP_EN = new Set(
  `a about above after again against all also am an and any are aren as at be because been before being below between both but by can cannot could did do does doing don down during each even ever every few for from further get gets got had has have having he her here hers herself him himself his how i if in into is isn it its itself just let like made make many may me might more most much must my myself never no nor not now of off often on once one only or other ought our ours ourselves out over own per perhaps quite rather really said same say says see seem seemed shall she should since so some still such than that the their theirs them themselves then there these they thing things this those though through thus to too under until up upon us very was we well were what when where whether which while who whom whose why will with within without would yet you your yours yourself yourselves first two three new way ways time times year years man men mr mrs went come came go going know knew think thought told tell back day days long little great good old take took put asked find found give gave keep kept want wanted done whole place part case nothing less another others something anything everything`.split(
    /\s+/,
  ),
);
const STOP_FR = new Set(
  `a à ai aie aient aies ait alors as au aucun aussi autre autres aux avaient avais avait avant avec avez avoir avons ayant bien c ça car ce ceci cela celle celles celui cependant certes ces cet cette ceux chacun chez ci comme comment d dans de des deux devant doit donc dont du elle elles en encore entre es est et étaient étais était été être eu eux fait faire fois furent fut grand ici il ils j je jusqu l la là le les leur leurs lors lui m ma mais me même mes moi moins mon n ne ni non nos notre nous on ont ou où par parce pas peu peut plus plusieurs pour pourquoi puis qu quand que quel quelle quelles quels qui quoi s sa sans se sera ses si sien sienne soi soit son sont sous sur t ta tant te tel telle tes toi ton tous tout toute toutes très tu un une vers voici voilà vos votre vous y dit sans faut avoir bon jour jours an ans homme hommes chose choses rien quelques quelque répondit dit-il demanda fit alors toujours jamais encore aucune aucun seulement point partant étoit étoient avoit après avant dire faire monsieur madame peu autant ainsi`.split(
    /\s+/,
  ),
);

/** Words that tend to mark a sentence carrying a lesson or a main point. */
const CUE = /\b(important|key|essential|principle|rule|lesson|secret|truth|must|should|never|always|best|most|matters?|means?|because|therefore|instead|the point|in short|important|essentiel|principe|règle|leçon|secret|vérité|doit|faut|jamais|toujours|mieux|parce que|donc|au lieu)\b/i;

const TOPIC_WORDS: Record<string, string[]> = {
  business: ['business', 'company', 'market', 'customer', 'customers', 'startup', 'product', 'sales', 'strategy', 'entreprise', 'marché', 'client', 'clients'],
  career: ['career', 'job', 'work', 'boss', 'interview', 'hire', 'promotion', 'carrière', 'emploi', 'travail', 'métier'],
  communication: ['speak', 'speaking', 'conversation', 'listen', 'listening', 'persuade', 'words', 'talk', 'parler', 'écouter', 'conversation'],
  creativity: ['creative', 'creativity', 'art', 'artist', 'ideas', 'writing', 'design', 'imagination', 'créativité', 'artiste', 'imagination'],
  health: ['health', 'body', 'sleep', 'food', 'diet', 'exercise', 'disease', 'brain', 'santé', 'corps', 'sommeil', 'nourriture'],
  history: ['war', 'empire', 'king', 'century', 'history', 'ancient', 'revolution', 'guerre', 'empire', 'roi', 'siècle', 'histoire'],
  leadership: ['leader', 'leaders', 'leadership', 'team', 'teams', 'change', 'organization', 'vision', 'manager', 'équipe', 'chef', 'dirigeant'],
  mindfulness: ['mind', 'calm', 'present', 'meditation', 'breath', 'peace', 'attention', 'esprit', 'calme', 'méditation', 'paix'],
  money: ['money', 'invest', 'investing', 'wealth', 'rich', 'debt', 'financial', 'income', 'argent', 'investir', 'richesse', 'dette'],
  philosophy: ['virtue', 'soul', 'reason', 'nature', 'wisdom', 'god', 'truth', 'philosophy', 'vertu', 'âme', 'raison', 'sagesse'],
  productivity: ['habit', 'habits', 'focus', 'goal', 'goals', 'time', 'productivity', 'task', 'tasks', 'habitude', 'objectif', 'tâche'],
  psychology: ['emotion', 'emotions', 'behavior', 'behaviour', 'bias', 'fear', 'happiness', 'motivation', 'émotion', 'peur', 'bonheur', 'comportement'],
  relationships: ['love', 'friend', 'friends', 'marriage', 'partner', 'family', 'children', 'amour', 'ami', 'amis', 'famille', 'couple'],
  science: ['science', 'universe', 'evolution', 'species', 'energy', 'scientist', 'experiment', 'univers', 'espèce', 'énergie', 'scientifique'],
};
const KID_TOPIC_WORDS: Record<string, string[]> = {
  'kids-animals': ['animal', 'animals', 'dog', 'cat', 'horse', 'bird', 'forest', 'animaux', 'chien', 'chat', 'oiseau'],
  'kids-space': ['space', 'star', 'stars', 'planet', 'moon', 'rocket', 'espace', 'étoile', 'planète', 'lune'],
  'kids-earth': ['earth', 'ocean', 'sea', 'river', 'mountain', 'weather', 'terre', 'océan', 'mer', 'montagne'],
  'kids-history': ['king', 'queen', 'castle', 'war', 'ancient', 'roi', 'reine', 'château'],
  'kids-life': ['friend', 'friends', 'feel', 'feelings', 'happy', 'sad', 'ami', 'amis', 'content', 'triste'],
};

const tokenize = (s: string) => s.toLowerCase().match(/[a-zà-ÿœæ']{3,}/g) ?? [];

function sentences(paragraph: string): string[] {
  const parts = paragraph
    .replace(/\s+/g, ' ')
    .trim()
    .match(/[^.!?…]+(?:[.!?…]+["»”’)]*|$)/g);
  return (parts ?? []).map((s) => s.trim()).filter((s) => s.length > 0);
}

const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

/** Chapter titles worth keeping as card titles: not "Chapter 3", "IV" or "Contents". */
function goodTitle(title: string | undefined): string | null {
  if (!title) return null;
  const t = title.replace(/\s+/g, ' ').trim();
  if (t.length < 3 || t.length > 70) return null;
  const bare = t.replace(/^(chapter|chapitre|part|partie|book|livre|section|lesson|leçon)\s+[\divxlc]+[.:\s-]*/i, '').trim();
  if (!bare || /^[\divxlc.\s-]+$/i.test(bare)) return null;
  if (/^(contents|table des matières|sommaire|preface|préface|foreword|introduction|index|copyright|acknowledg|remerciements|notes?|bibliograph|about the author|dedication|title ?page|half ?title|cover|imprint|colophon|uncopyright|endnotes|glossary|epigraph|appendix|licen[cs]e|project gutenberg|table of contents|list of)/i.test(bare)) return null;
  return bare.charAt(0).toUpperCase() + bare.slice(1);
}

type Part = { title?: string; text: string[] };

/** Splits the book into up to MAX_IDEAS parts: whole chapters when there are enough, even slices otherwise. */
const BOILERPLATE = /project gutenberg|gutenberg\.org|this ebook|this e-book|electronic works?|refund|donations?|trademark|all rights reserved|isbn|copyright ©|tous droits réservés|license|licence/i;

function partsOf(book: FullBook): Part[] {
  const keep = (p: string) => wordCount(p) >= 8 && !BOILERPLATE.test(p);
  const chapters = book.chapters
    .map((c) => ({ title: c.title, text: c.paragraphs.filter(keep) }))
    .filter((c) => c.text.join(' ').split(/\s+/).length >= 150 && !/^(contents|table des matières|sommaire|index|copyright|imprint|colophon|uncopyright|endnotes|title ?page|project gutenberg|licen[cs]e)/i.test(c.title ?? ''));
  if (chapters.length >= MIN_IDEAS && chapters.length <= MAX_IDEAS) return chapters;
  if (chapters.length > MAX_IDEAS) {
    // Many short chapters: group neighbours so each card covers a stretch of the book.
    const per = Math.ceil(chapters.length / MAX_IDEAS);
    const groups: Part[] = [];
    for (let i = 0; i < chapters.length; i += per) {
      const group = chapters.slice(i, i + per);
      groups.push({ title: group.map((g) => goodTitle(g.title)).find(Boolean) ?? undefined, text: group.flatMap((g) => g.text) });
    }
    return groups;
  }
  // Few or no chapters (most PDFs): cut the text into even slices.
  const paragraphs = book.chapters.flatMap((c) => c.paragraphs).filter(keep);
  const total = paragraphs.reduce((n, p) => n + wordCount(p), 0);
  const n = Math.max(1, Math.min(MAX_IDEAS, Math.floor(total / 400)));
  const target = total / n;
  const slices: Part[] = [];
  let current: string[] = [];
  let words = 0;
  for (const p of paragraphs) {
    current.push(p);
    words += wordCount(p);
    if (words >= target && slices.length < n - 1) {
      slices.push({ text: current });
      current = [];
      words = 0;
    }
  }
  if (current.length) slices.push({ text: current });
  return slices;
}

function guessTopic(freq: Map<string, number>, kid: boolean): string {
  const table = kid ? KID_TOPIC_WORDS : TOPIC_WORDS;
  let best = kid ? 'kids-stories' : 'philosophy';
  let bestScore = 0;
  for (const [topic, words] of Object.entries(table)) {
    const score = words.reduce((n, w) => n + (freq.get(w) ?? 0), 0);
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  return best;
}

const capitalize = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

/** Makes the idea cards for a whole book. Runs in a fraction of a second, even for long books. */
export function makeOwnIdeas(book: FullBook, opts: { kid?: boolean } = {}): OwnIdeasResult {
  const sample = book.chapters.flatMap((c) => c.paragraphs).slice(0, 200).join(' ');
  const lang = detectLang(sample);
  const stop = lang === 'fr' ? STOP_FR : STOP_EN;
  const parts = partsOf(book);

  // Word counts per part and across the book, to find what each part is especially about.
  const partFreqs = parts.map((p) => {
    const f = new Map<string, number>();
    for (const w of tokenize(p.text.join(' '))) if (!stop.has(w)) f.set(w, (f.get(w) ?? 0) + 1);
    return f;
  });
  const bookFreq = new Map<string, number>();
  const partsWith = new Map<string, number>();
  for (const f of partFreqs) {
    for (const [w, n] of f) {
      bookFreq.set(w, (bookFreq.get(w) ?? 0) + n);
      partsWith.set(w, (partsWith.get(w) ?? 0) + 1);
    }
  }
  // Names and other words that are always capitalised make poor card titles.
  const lowerSeen = new Set(book.chapters.flatMap((c) => c.paragraphs).join(' ').match(/(?<![A-Za-zÀ-ÿ'])[a-zà-ÿœæ][a-zà-ÿœæ']{2,}/g) ?? []);
  const capitalisedOnly = (w: string) => !lowerSeen.has(w);

  const ideas: OwnIdea[] = [];
  const passages: OwnIdeasResult['passages'] = [];
  const usedTitles = new Set<string>();
  parts.forEach((part, index) => {
    const freq = partFreqs[index];
    const max = Math.max(1, ...freq.values());
    // A word's weight: how often this part uses it, more if few other parts do.
    const weight = (w: string) => ((freq.get(w) ?? 0) / max) * Math.log(1 + parts.length / (partsWith.get(w) ?? 1));
    const list = part.text.flatMap((p, pi) => sentences(p).map((s, si) => ({ s, pi, si })));
    if (list.length === 0) return;
    const scored = list.map((x, order) => {
      const words = tokenize(x.s).filter((w) => !stop.has(w));
      const n = wordCount(x.s);
      let score = words.reduce((sum, w) => sum + weight(w), 0) / Math.sqrt(Math.max(words.length, 1));
      if (n < 8 || n > 55) score *= 0.4;
      if (/^["«“—–-]/.test(x.s) || /[?]$/.test(x.s)) score *= 0.6; // dialogue and questions rarely state the idea
      if (CUE.test(x.s)) score *= 1.25;
      if (/\d{3,}|https?:|www\.|©|isbn/i.test(x.s)) score *= 0.3;
      return { ...x, order, score };
    });
    const ranked = [...scored].sort((a, b) => b.score - a.score);
    // Take the best sentences until the card is long enough, then put them back in reading order.
    const picked: typeof scored = [];
    let words = 0;
    for (const c of ranked) {
      if (words >= MIN_WORDS) break;
      const n = wordCount(c.s);
      if (words + n > MAX_WORDS && picked.length) continue;
      if (picked.some((p) => p.s === c.s)) continue;
      picked.push(c);
      words += n;
      if (picked.length >= 4) break;
    }
    if (!picked.length) return;
    // A wider pick (about 700 words) gives an AI enough to summarise the part well.
    const wide: typeof scored = [];
    let wideWords = 0;
    for (const c of ranked) {
      if (wideWords >= PASSAGE_WORDS) break;
      if (wide.some((p) => p.s === c.s)) continue;
      wide.push(c);
      wideWords += wordCount(c.s);
    }
    wide.sort((a, b) => a.order - b.order);
    const passageText = wide.map((p) => p.s).join(' ');
    picked.sort((a, b) => a.order - b.order);
    const body = picked
      .map((p, i) => {
        const prev = picked[i - 1];
        const gap = prev && !(prev.pi === p.pi && prev.si + 1 === p.si);
        return `${gap ? '… ' : ''}${p.s}`;
      })
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^[a-zà-ÿ]/, (c) => c.toUpperCase());

    let title = goodTitle(part.title);
    if (title && title.toLowerCase() === book.title.trim().toLowerCase()) title = null;
    if (!title || usedTitles.has(title)) {
      // Named after what this part talks about most, compared with the rest of the book ("On perseverance").
      const top = [...freq.keys()]
        .filter((w) => w.length > 4 && !w.includes("'") && (freq.get(w) ?? 0) >= 2 && !capitalisedOnly(w) && !usedTitles.has(w))
        .sort((a, b) => weight(b) - weight(a))[0];
      title = top ? (lang === 'fr' ? capitalize(top) : `On ${top}`) : `${lang === 'fr' ? 'Idée' : 'Idea'} ${index + 1}`;
      usedTitles.add(top ?? '');
    }
    usedTitles.add(title);
    ideas.push({ title, body });
    passages.push({ title: goodTitle(part.title) ?? undefined, text: passageText });
  });

  const themes = [...bookFreq.keys()]
    .filter((w) => w.length > 3 && !w.includes("'") && !capitalisedOnly(w))
    .sort((a, b) => (bookFreq.get(b) ?? 0) - (bookFreq.get(a) ?? 0))
    .slice(0, 5);
  const description =
    lang === 'fr'
      ? `${ideas.length} idées principales tirées de votre livre par l'app. Thèmes : ${themes.join(', ')}.`
      : `${ideas.length} main ideas the app picked out of your book. It keeps coming back to ${themes.slice(0, -1).join(', ')}${themes.length > 1 ? ' and ' : ''}${themes[themes.length - 1] ?? ''}.`;

  return { ideas, description, topicId: guessTopic(bookFreq, !!opts.kid), lang, passages };
}

/** Turns PDF page texts into the book shape the idea maker reads (one paragraph per line-run). */
export function pdfPagesAsBook(title: string, pages: string[]): FullBook {
  const paragraphs = pages
    .flatMap((page) => page.split(/\n\s*\n/))
    .map((p) => p.replace(/-\n(\w)/g, '$1').replace(/\s*\n\s*/g, ' ').trim())
    .filter((p) => p.length > 0);
  return { title, author: '', chapters: [{ title: '', paragraphs }] };
}
