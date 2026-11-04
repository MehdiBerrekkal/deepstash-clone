/**
 * Who the app is for: a kid or an adult. Chosen on the very first screen and changeable in You → Who's reading.
 * Kid mode shows kid topics and cards, children's books, easier games and the kids' quizzes; adult mode shows the rest.
 */
export type Audience = 'kid' | 'adult';

/** Kid topics, cards and books all have ids starting with this. */
export const KID_PREFIX = 'kids-';
export const isKidId = (id: string | undefined) => !!id && id.startsWith(KID_PREFIX);

/** Full books (public domain) that suit children, shown on the kids' Library shelves. */
export const KID_CLASSICS = new Set([
  'alice-in-wonderland',
  'frances-hodgson-burnett-the-secret-garden',
  'kenneth-grahame-the-wind-in-the-willows',
  'l-m-montgomery-anne-of-green-gables',
  'mark-twain-the-adventures-of-tom-sawyer',
  'robert-louis-stevenson-treasure-island',
  'jack-london-the-call-of-the-wild',
  'jules-verne-around-the-world-in-eighty-days',
  'jules-verne-journey-to-the-center-of-the-earth',
  'jonathan-swift-gullivers-travels',
  'charles-dickens-a-christmas-carol',
  'arthur-conan-doyle-the-adventures-of-sherlock-holmes',
  'joshua-slocum-sailing-alone-around-the-world',
  'h-g-wells-the-time-machine',
  'fr-fables-la-fontaine',
  'fr-tour-du-monde',
  'fr-voyage-centre-terre',
  'rudyard-kipling-the-jungle-book',
  'louisa-may-alcott-little-women',
]);

/** Brain games that don't suit young children (abstract nonsense words, money maths). */
export const ADULT_ONLY_GAMES = new Set(['syllogism', 'word']);

/** Ages each group covers, for the IQ-style test's age norms. */
export const AGE_RANGE: Record<Audience, [number, number]> = { kid: [6, 12], adult: [13, 90] };
export const DEFAULT_AGE: Record<Audience, number> = { kid: 9, adult: 30 };

export function ageFrom(birthYear: number | undefined, audience: Audience | undefined) {
  const a = audience ?? 'adult';
  if (!birthYear) return DEFAULT_AGE[a];
  return new Date().getFullYear() - birthYear;
}
