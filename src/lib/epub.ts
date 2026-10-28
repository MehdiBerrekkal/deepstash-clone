import JSZip from 'jszip';

import type { FullBook } from '@/lib/fullbook';

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };

function decode(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

const stripTags = (s: string) => decode(s.replace(/<[^>]+>/g, '')).replace(/[ \t\r\n]+/g, ' ').trim();

function attr(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1];
}

function resolve(base: string, href: string): string {
  const parts = base.split('/').slice(0, -1);
  for (const seg of decodeURIComponent(href.split('#')[0]).split('/')) {
    if (seg === '..') parts.pop();
    else if (seg !== '.') parts.push(seg);
  }
  return parts.join('/');
}

const BREAK = ' ';

/** Turns one XHTML chapter into a title and plain-text paragraphs. Regex based, since there is no DOMParser on native. */
function parseChapter(html: string, fallbackTitle: string) {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  // Source line wraps are just whitespace; only <br> is a real line break (kept for poetry).
  const cleaned = body
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, BREAK);
  const title = stripTags(cleaned.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i)?.[1] ?? '').replaceAll(BREAK, ' ').trim() || fallbackTitle;
  const paragraphs = cleaned
    .split(/<\/?(?:p|div|h[1-6]|li|blockquote|section|tr|pre)\b[^>]*>/i)
    .map((chunk) => stripTags(chunk).replace(new RegExp(`\\s*${BREAK}\\s*`, 'g'), '\n').trim())
    .filter((p) => p.length > 0);
  return { title: title.slice(0, 120), paragraphs };
}

/** Reads a DRM-free EPUB entirely on the device. Throws a readable message for files it can't open. */
export async function parseEpub(data: ArrayBuffer | Uint8Array, fileName: string): Promise<FullBook> {
  const zip = await JSZip.loadAsync(data);
  if (zip.file('META-INF/encryption.xml') && /EncryptedData/.test(await zip.file('META-INF/encryption.xml')!.async('string'))) {
    throw new Error('This EPUB is DRM-protected, so it can only be read in the app it was bought from.');
  }
  const container = await zip.file('META-INF/container.xml')?.async('string');
  const opfPath = container && attr(container.match(/<rootfile\b[^>]*>/i)?.[0] ?? '', 'full-path');
  const opf = opfPath && (await zip.file(opfPath)?.async('string'));
  if (!opfPath || !opf) throw new Error("This doesn't look like a valid EPUB file.");

  const title = stripTags(opf.match(/<dc:title[^>]*>([\s\S]*?)<\/dc:title>/i)?.[1] ?? '') || fileName.replace(/\.epub$/i, '');
  const author = stripTags(opf.match(/<dc:creator[^>]*>([\s\S]*?)<\/dc:creator>/i)?.[1] ?? '') || 'Unknown author';

  const manifest = new Map<string, string>();
  for (const item of opf.match(/<item\b[^>]*>/gi) ?? []) {
    const id = attr(item, 'id');
    const href = attr(item, 'href');
    if (id && href) manifest.set(id, resolve(opfPath, href));
  }
  const spine = (opf.match(/<itemref\b[^>]*>/gi) ?? []).map((ref) => manifest.get(attr(ref, 'idref') ?? '')).filter(Boolean) as string[];

  const chapters: FullBook['chapters'] = [];
  for (const href of spine) {
    const html = await zip.file(href)?.async('string');
    if (!html) continue;
    const chapter = parseChapter(html, `Section ${chapters.length + 1}`);
    if (chapter.paragraphs.join(' ').length > 40) chapters.push(chapter);
  }
  if (chapters.length === 0) throw new Error('No readable text was found in this EPUB.');
  return { title, author, chapters };
}
