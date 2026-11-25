export type CatalogBook = {
  id: string;
  title: string;
  author: string;
  cover?: string;
  page: string;
};

const catalog = 'https://openlibrary.org';

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
  return books.filter((book) => {
    const key = `${normalize(book.title)}|${normalize(book.author)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function bookRecap(book: CatalogBook, signal: AbortSignal): Promise<string | undefined> {
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

