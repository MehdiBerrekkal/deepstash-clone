export type CatalogBook = {
  id: string;
  title: string;
  author: string;
  cover?: string;
  page: string;
  recap?: string;
  language?: 'en' | 'fr';
  pdf?: { url: string; source: string; web: boolean };
  accessLabel?: string;
};

const catalog = 'https://openlibrary.org';

const indexedBooks: CatalogBook[] = [{
  id: 'OL17202732W',
  title: "L’homme qui voulait être heureux",
  author: 'Laurent Gounelle',
  language: 'fr',
  cover: 'https://covers.openlibrary.org/b/isbn/9782266186674-M.jpg',
  page: 'https://openlibrary.org/works/OL17202732W',
  recap: 'En vacances à Bali, un voyageur rencontre un guérisseur qui l’invite à examiner les croyances qui l’empêchent d’être heureux. À travers leurs échanges, il découvre comment ces croyances orientent ses choix et ce qu’il peut changer pour vivre autrement.',
}, {
  id: 'openstax-psychology-2e',
  title: 'Psychology 2e',
  author: 'Rose M. Spielman, William J. Jenkins, Marilyn D. Lovett',
  page: 'https://openstax.org/details/books/psychology-2e',
  recap: 'An introductory textbook on behavior and mental processes, covering learning, memory, development, social behavior, and mental health.',
  pdf: { url: 'https://assets.openstax.org/oscms-prodcms/media/documents/Psychology2e_WEB.pdf', source: 'OpenStax', web: true },
}, {
  id: 'planet-frankenstein',
  title: 'Frankenstein',
  author: 'Mary Shelley',
  page: 'https://www.planetebook.com/frankenstein/',
  cover: 'https://covers.openlibrary.org/b/isbn/9780141439471-M.jpg',
  recap: 'Victor Frankenstein creates a living being and abandons him. Their choices set off a cycle of isolation, revenge, and loss.',
  pdf: { url: 'https://www.planetebook.com/free-ebooks/frankenstein.pdf', source: 'Planet eBook', web: true },
}, {
  id: 'planet-pride-and-prejudice',
  title: 'Pride and Prejudice',
  author: 'Jane Austen',
  page: 'https://www.planetebook.com/pride-and-prejudice/',
  cover: 'https://covers.openlibrary.org/b/id/14348537-M.jpg',
  recap: 'Elizabeth Bennet and Mr. Darcy reconsider their first impressions as they navigate family expectations, class, and marriage.',
  pdf: { url: 'https://www.planetebook.com/free-ebooks/pride-and-prejudice.pdf', source: 'Planet eBook', web: true },
}];

const recentEditions = [
  ['yesteryear', 'Yesteryear', 'Caro Claire Burke', 'https://www.penguinrandomhouse.com/books/780686/yesteryear-a-gma-book-club-pick-by-caro-claire-burke/', 'View publisher options', 'An influencer who sells an idealized version of traditional family life wakes up in 1855 and struggles to understand how she got there.'],
  ['calamity-club', 'The Calamity Club', 'Kathryn Stockett', 'https://www.overdrive.com/media/12073749', 'Check library availability', 'In Depression-era Mississippi, women facing very different hardships form an unlikely alliance.'],
  ['hollywood-ending', 'Hollywood, Ending', 'John Green', 'https://www.overdrive.com/media/13002831', 'Check library availability', 'A Hollywood romance unfolds under public scrutiny as two young people try to trust each other and make art.'],
  ['american-hagwon', 'American Hagwon', 'Min Jin Lee', 'https://www.overdrive.com/media/12700978', 'Check library availability', 'A sweeping novel about family, ambition, and the sacrifices people make to build a life across cultures.'],
  ['cool-machine', 'Cool Machine', 'Colson Whitehead', 'https://www.overdrive.com/media/12480964', 'Check library availability', 'The final Harlem Trilogy novel follows Ray Carney through a changing New York in the 1980s.'],
  ['whistler', 'Whistler', 'Ann Patchett', 'https://www.overdrive.com/media/12430206/whistler', 'Check library availability', 'An unexpected encounter brings long-buried family memories and relationships back into view.'],
  ['london-falling', 'London Falling', 'Patrick Radden Keefe', 'https://www.overdrive.com/media/12086358/london-falling', 'Check library availability', 'A family looks for answers after a mysterious death, exposing a world of wealth and deception in London.'],
  ['kin', 'Kin', 'Tayari Jones', 'https://www.overdrive.com/media/12297806', 'Check library availability', 'Two childhood friends confront the complicated bonds between mothers and daughters as their lives take different paths.'],
  ['hymn-to-life', 'A Hymn to Life', 'Gisèle Pelicot', 'https://www.overdrive.com/media/12163320/a-hymn-to-life', 'Check library availability', 'Pelicot recounts reclaiming her voice after discovering the crimes committed against her and choosing to speak publicly.'],
  ['dey', 'Dèy', 'Edwidge Danticat', 'https://www.penguinrandomhouse.com/books/768725/dey-by-edwidge-danticat/', 'View publisher options', 'A novel that moves between Haiti and Brooklyn and follows the connections people carry across borders.'],
].map(([id, title, author, page, accessLabel, recap]): CatalogBook => ({ id, title, author, page, accessLabel, recap }));
indexedBooks.push(...recentEditions);

export function localBookMatches(query: string, language: 'en' | 'fr' | 'all'): CatalogBook[] {
  const terms = normalize(query).split(' ').filter(Boolean);
  if (!terms.length) return [];
  return indexedBooks.filter((book) => {
    if (language !== 'all' && (book.language || 'en') !== language) return false;
    const words = new Set(normalize(book.title + ' ' + book.author).split(' '));
    return terms.every((term) => words.has(term));
  });
}

async function catalogJson(url: string, signal?: AbortSignal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error('The book catalog is temporarily unavailable.');
  return response.json();
}

export async function searchBookCatalog(query: string, language: 'en' | 'fr' | 'all', signal: AbortSignal): Promise<CatalogBook[]> {
  const params = new URLSearchParams({
    q: query,
    fields: 'key,title,author_name,cover_i',
    limit: '12',
    ...(language === 'all' ? {} : { lang: language }),
  });
  const data = await catalogJson(`${catalog}/search.json?${params}`, signal);
  if (!data.docs?.length && normalize(query) !== query.trim().toLowerCase()) {
    params.set('q', normalize(query));
    const fallback = await catalogJson(`${catalog}/search.json?${params}`, signal);
    data.docs = fallback.docs;
  }
  const books: CatalogBook[] = (Array.isArray(data.docs) ? data.docs : []).flatMap((entry: { key?: string; title?: string; author_name?: string[]; cover_i?: number }) => {
    const id = entry.key?.match(/^(?:\/works\/)?(OL\d+W)$/)?.[1];
    if (!id || !entry.title) return [];
    return [{
      id,
      title: entry.title,
      author: entry.author_name?.join(', ') || 'Unknown author',
      cover: entry.cover_i ? `https://covers.openlibrary.org/b/id/${entry.cover_i}-M.jpg?default=false` : undefined,
      page: `${catalog}/works/${id}`,
    }];
  });
  const seen = new Set<string>();
  return [...localBookMatches(query, language), ...books].filter((book) => {
    const key = `${normalize(book.title)}|${normalize(book.author)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function bookRecap(book: CatalogBook, signal: AbortSignal): Promise<string | undefined> {
  if (book.recap) return book.recap;
  if (kotterPdf(book)) {
    return 'Kotter explains why major organizational changes stall and presents an eight-stage process for carrying them through. The process starts with urgency and a coalition, builds momentum through visible wins, and ends by embedding new practices in the organization’s culture.';
  }
  const work = await catalogJson(`${catalog}/works/${book.id}.json`, signal);
  const description = typeof work.description === 'string' ? work.description : work.description?.value;
  if (typeof description !== 'string') return undefined;
  const clean = description.replace(/<[^>]*>/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ').trim();
  if (clean.length <= 520) return clean || undefined;
  return clean.slice(0, 517).replace(/\s+\S*$/, '') + '…';
}

const normalize = (value: string) => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function sameBook(book: CatalogBook, title: string, authors: string[]) {
  const author = normalize(book.author);
  return normalize(book.title) === normalize(title) && authors.some((name) => normalize(name) === author);
}

export function kotterPdf(book: CatalogBook) {
  return ['leading change', 'leading change with a new preface by the author'].includes(normalize(book.title)) && normalize(book.author) === 'john p kotter'
    ? 'https://sektor-api.argos.uz/media/20.LEADING_CHANGE_si7IDRA.pdf'
    : undefined;
}

