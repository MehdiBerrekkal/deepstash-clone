import { arrange, pick, shuffle, type Item, type Rng } from '@/lib/brain/core';

/**
 * Original word items for the IQ-style test's verbal index, from very easy (1, for young children) to very hard (10).
 * Vocabulary: pick the meaning. Similarities: pick the best way two things are alike (the most general true answer,
 * as in classic similarities tasks, beats a surface likeness).
 */
type VocabRow = [word: string, answer: string, wrong: string[], level: number];
const VOCAB: VocabRow[] = [
  ['big', 'large', ['small', 'red', 'fast', 'soft'], 1],
  ['happy', 'glad', ['sad', 'sleepy', 'cross', 'quiet'], 1],
  ['shut', 'close', ['open', 'push', 'cut', 'look'], 1],
  ['fast', 'quick', ['slow', 'loud', 'heavy', 'wet'], 1],
  ['begin', 'start', ['finish', 'stop', 'wait', 'jump'], 2],
  ['tiny', 'very small', ['very loud', 'very old', 'very tall', 'very bright'], 2],
  ['gift', 'present', ['letter', 'party', 'box', 'secret'], 2],
  ['damp', 'slightly wet', ['very cold', 'dirty', 'dark', 'sticky'], 2],
  ['brave', 'courageous', ['clever', 'kind', 'shy', 'strong'], 3],
  ['ancient', 'very old', ['very large', 'broken', 'precious', 'far away'], 3],
  ['enormous', 'huge', ['heavy', 'strange', 'scary', 'loud'], 3],
  ['vanish', 'disappear', ['appear', 'shrink', 'fall', 'hide'], 3],
  ['fragile', 'easily broken', ['very light', 'made of glass', 'expensive', 'thin'], 4],
  ['conceal', 'hide', ['reveal', 'steal', 'seal', 'carry'], 4],
  ['cautious', 'careful', ['nervous', 'slow', 'clever', 'worried'], 4],
  ['reluctant', 'unwilling', ['unable', 'late', 'rude', 'tired'], 4],
  ['frugal', 'thrifty', ['fruity', 'greedy', 'poor', 'fragile'], 5],
  ['candid', 'frank', ['sweet', 'secret', 'bright', 'rehearsed'], 5],
  ['diligent', 'hard-working', ['intelligent', 'gentle', 'tidy', 'punctual'], 5],
  ['serene', 'calm and peaceful', ['sad and quiet', 'clear and bright', 'serious', 'proud'], 5],
  ['meagre', 'scanty', ['thin', 'mean', 'bitter', 'average'], 5],
  ['ambiguous', 'open to more than one meaning', ['ambitious', 'unclear in origin', 'two-handed', 'hostile'], 6],
  ['benevolent', 'kindly', ['wealthy', 'violent', 'religious', 'powerful'], 6],
  ['tenacious', 'persistent', ['tense', 'tender', 'aggressive', 'sticky'], 6],
  ['ephemeral', 'short-lived', ['heavenly', 'delicate', 'imaginary', 'secret'], 6],
  ['lucid', 'clear', ['lucky', 'bright-coloured', 'loose', 'dreamy'], 6],
  ['gregarious', 'sociable', ['greedy', 'grand', 'noisy', 'religious'], 7],
  ['laconic', 'using few words', ['lazy', 'lacking colour', 'cheerful', 'rude'], 7],
  ['mitigate', 'lessen', ['move', 'worsen', 'imitate', 'measure'], 7],
  ['pragmatic', 'practical', ['dramatic', 'stubborn', 'proud', 'theoretical'], 7],
  ['ubiquitous', 'found everywhere', ['unique', 'ancient', 'unknown', 'uncertain'], 7],
  ['obsequious', 'too eager to please', ['obvious', 'stubborn', 'secretive', 'old-fashioned'], 8],
  ['perfunctory', 'done without care', ['perfect', 'done in advance', 'forceful', 'temporary'], 8],
  ['equanimity', 'calm under stress', ['equality', 'fairness', 'indifference', 'balance of power'], 8],
  ['recalcitrant', 'stubbornly uncooperative', ['recurring', 'calculated', 'repentant', 'reclusive'], 8],
  ['esoteric', 'understood by few', ['external', 'elegant', 'exotic', 'ancient'], 8],
  ['pusillanimous', 'cowardly', ['tiny', 'gloomy', 'petty', 'puzzling'], 9],
  ['tendentious', 'biased', ['tense', 'tentative', 'tedious', 'tender'], 9],
  ['obstreperous', 'noisy and unruly', ['obstinate', 'obscure', 'obedient', 'overweight'], 9],
  ['perspicacious', 'shrewdly perceptive', ['sweaty', 'persistent', 'transparent', 'suspicious'], 9],
  ['apocryphal', 'of doubtful truth', ['catastrophic', 'prophetic', 'ancient', 'secretive'], 10],
  ['pellucid', 'transparently clear', ['shiny', 'thin-skinned', 'feathery', 'pale'], 10],
  ['otiose', 'serving no purpose', ['lazy', 'oval', 'loud', 'leisurely'], 10],
  ['sedulous', 'diligent', ['seductive', 'sitting', 'sedative', 'secretive'], 10],
  ['jejune', 'naive and simplistic', ['youthful', 'cheerful', 'hungry', 'jealous'], 10],
];

type SimRow = [a: string, b: string, answer: string, wrong: string[], level: number];
const SIMILAR: SimRow[] = [
  ['an apple', 'a banana', 'Both are fruit', ['Both are red', 'Both grow under the ground', 'Both are long', 'Both are vegetables'], 1],
  ['a dog', 'a cat', 'Both are animals', ['Both bark', 'Both have stripes', 'Both live in water', 'Both are toys'], 1],
  ['a shirt', 'trousers', 'Both are clothes', ['Both have buttons', 'Both are blue', 'Both go on your legs', 'Both are soft toys'], 1],
  ['a car', 'a bicycle', 'Both are ways to travel', ['Both have engines', 'Both have four wheels', 'Both use petrol', 'Both are red'], 2],
  ['a pencil', 'a pen', 'Both are used for writing', ['Both are made of wood', 'Both have ink', 'Both are yellow', 'Both can be sharpened'], 2],
  ['a piano', 'a guitar', 'Both are musical instruments', ['Both have strings you pluck', 'Both are made of wood', 'Both are big', 'Both have keys'], 2],
  ['a hand', 'a foot', 'Both are parts of the body', ['Both have five toes', 'Both wear shoes', 'Both are used to walk', 'Both have nails'], 3],
  ['milk', 'juice', 'Both are drinks', ['Both are white', 'Both come from cows', 'Both are sweet', 'Both are cold'], 3],
  ['rain', 'snow', 'Both are water falling from the sky', ['Both are cold', 'Both are white', 'Both make puddles', 'Both happen in winter'], 3],
  ['anger', 'joy', 'Both are feelings', ['Both make you shout', 'Both are bad', 'Both last a long time', 'Both are colours'], 4],
  ['a ruler', 'a clock', 'Both are used to measure', ['Both have numbers', 'Both are made of plastic', 'Both hang on walls', 'Both are long'], 4],
  ['an elbow', 'a knee', 'Both are joints', ['Both are in the arm', 'Both are bones', 'Both get scraped', 'Both are round'], 4],
  ['an island', 'a peninsula', 'Both are land surrounded (fully or partly) by water', ['Both are in the sea', 'Both are small', 'Both have beaches', 'Both are countries'], 5],
  ['a seed', 'an egg', 'Both hold the beginning of a new life', ['Both are small', 'Both are food', 'Both are round', 'Both have a shell'], 5],
  ['a poem', 'a statue', 'Both are works of art', ['Both are made of words', 'Both are old', 'Both are in museums', 'Both rhyme'], 5],
  ['hibernation', 'migration', 'Both are ways animals cope with the seasons', ['Both mean sleeping', 'Both are journeys', 'Both happen in summer', 'Both are done by birds'], 6],
  ['a telescope', 'a microscope', 'Both help us see what the eye can’t', ['Both look at stars', 'Both are made of glass', 'Both are used in labs', 'Both are long tubes'], 6],
  ['a law', 'a custom', 'Both are rules that guide how people behave', ['Both are written down', 'Both are made by judges', 'Both are old', 'Both are punished'], 6],
  ['a fly', 'a tree', 'Both are living things', ['Both have wings', 'Both live outdoors', 'Both are green', 'Both are small'], 7],
  ['praise', 'punishment', 'Both are ways to influence behaviour', ['Both are bad', 'Both are given by teachers', 'Both make people happy', 'Both are words'], 7],
  ['a friend', 'an enemy', 'Both describe a relationship with someone', ['Both are nice', 'Both are people you see often', 'Both are opposite', 'Both are chosen at school'], 7],
  ['first', 'last', 'Both are positions in an order', ['Both are numbers', 'Both are winners', 'Both are opposites', 'Both are at the start'], 8],
  ['steam', 'ice', 'Both are forms of water', ['Both are cold', 'Both are hot', 'Both are gases', 'Both can burn you'], 8],
  ['liberty', 'justice', 'Both are ideals a society can aim for', ['Both are statues', 'Both are rights in law', 'Both mean freedom', 'Both are political parties'], 8],
  ['hope', 'fear', 'Both are feelings about what may happen', ['Both are bad', 'Both are good', 'Both are opposites', 'Both are thoughts about the past'], 9],
  ['a map', 'an equation', 'Both represent something in a simplified form', ['Both use numbers', 'Both are drawn', 'Both are found in books', 'Both are used at school'], 9],
  ['a vaccine', 'a fire drill', 'Both prepare you for a danger in advance', ['Both are medical', 'Both are done at school', 'Both are painful', 'Both are compulsory'], 9],
  ['a fable', 'a parable', 'Both are short stories that teach a lesson', ['Both have talking animals', 'Both are religious', 'Both are poems', 'Both are true'], 10],
  ['evolution', 'a market', 'Both are processes where competition decides what survives', ['Both are about money', 'Both are very slow', 'Both are planned', 'Both are about animals'], 10],
  ['a scaffold', 'a hypothesis', 'Both are temporary supports for building something lasting', ['Both are made of metal', 'Both are guesses', 'Both are used by scientists', 'Both are dangerous'], 10],
];

/** Picks an unused row whose level is closest to the wanted difficulty (ties broken at random). */
function nearest<T extends unknown[]>(rng: Rng, rows: T[], d: number, used: Set<number>, level: (r: T) => number) {
  const free = rows.map((r, i) => i).filter((i) => !used.has(i));
  const pool = free.length ? free : rows.map((_, i) => i);
  const best = Math.min(...pool.map((i) => Math.abs(level(rows[i]) - d)));
  const i = pick(rng, pool.filter((k) => Math.abs(level(rows[k]) - d) === best));
  used.add(i);
  return rows[i];
}

/** Item makers that never repeat a word within one test. */
export function makeVerbalBank() {
  const usedV = new Set<number>();
  const usedS = new Set<number>();
  const vocab = (d: number, rng: Rng): Item => {
    const [word, ans, wrong, level] = nearest(rng, VOCAB, d, usedV, (r) => r[3]);
    const { options, answer } = arrange(rng, ans, shuffle(rng, wrong).slice(0, 4));
    return { kind: 'verbal', ask: 'Which answer means the same?', prompt: `“${word}”`, options, answer, explain: `“${word}” means ${ans}.`, difficulty: level };
  };
  const similar = (d: number, rng: Rng): Item => {
    const [a, b, ans, wrong, level] = nearest(rng, SIMILAR, d, usedS, (r) => r[4]);
    const { options, answer } = arrange(rng, ans, shuffle(rng, wrong).slice(0, 4));
    return { kind: 'verbal', ask: 'How are they alike? Pick the best answer.', prompt: `${a[0].toUpperCase()}${a.slice(1)} and ${b}`, options, answer, explain: `${ans}.`, difficulty: level };
  };
  return { vocab, similar };
}
