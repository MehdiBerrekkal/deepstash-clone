// Downloads public-domain books from Project Gutenberg (stripping the Gutenberg license header and footer)
// and Creative Commons books from their authors' own sites (keeping the author's license notice), splits them into chapters and writes compact assets to src/data/classics/:
//   <id>.txt   JSON { chapters: [{ title, paragraphs }] }, loaded on demand by the reader
//   index.json the catalogue (title, author, translator, size, linked library book)
//   assets.ts  the require() map Metro needs to bundle the .txt assets
// Usage: node scripts/build-classics.js [cacheDir]   (downloads are cached between runs)
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'src', 'data', 'classics');
const cacheDir = process.argv[2] ?? path.join(require('os').tmpdir(), 'gutenberg-cache');

/**
 * gutenberg: ebook number. sourceId: the library book whose page gets a "Read full book" button.
 * heading: regex for chapter heading lines when the blank-line heuristic isn't enough.
 * inlineHeading: regex for a chapter number at the start of a paragraph line (group 1 is the number).
 * verse: keep line breaks inside paragraphs (poetry, aphorisms). chunk: skip headings, cut into even parts.
 * Headings must start at column 0, so indented table-of-contents lines don't count.
 * url + license: a Creative Commons book from the author's official site, bundled under that license. Only licenses
 * that allow redistribution belong here; free-but-all-rights-reserved books get a link in the library instead.
 */
const BOOKS = [
  { id: 'meditations', gutenberg: 2680, title: 'Meditations', author: 'Marcus Aurelius', translator: 'Meric Casaubon', year: 180, topicId: 'philosophy', sourceId: 'meditations', heading: /^(THE )?(FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH|ELEVENTH|TWELFTH) BOOK$|^(INTRODUCTION|APPENDIX|GLOSSARY|NOTES)$/ },
  { id: 'enchiridion', gutenberg: 45109, title: 'The Enchiridion', author: 'Epictetus', translator: 'Thomas Wentworth Higginson', year: 125, topicId: 'philosophy', sourceId: 'enchiridion' },
  { id: 'art-of-war', gutenberg: 132, title: 'The Art of War', author: 'Sun Tzu', translator: 'Lionel Giles', year: -500, topicId: 'leadership', sourceId: 'the-art-of-war', heading: /^(Introduction|Chapter [IVXL]+\. .+)$/ },
  { id: 'tao-te-ching', gutenberg: 216, title: 'Tao Te Ching', author: 'Lao Tzu', translator: 'James Legge', year: -400, topicId: 'philosophy', sourceId: 'tao-te-ching', inlineHeading: /^(?:Ch\. )?(\d+)\. (?=1\. )/ },
  { id: 'republic', gutenberg: 1497, title: 'The Republic', author: 'Plato', translator: 'Benjamin Jowett', year: -375, topicId: 'philosophy', sourceId: 'the-republic', heading: /^ ?(INTRODUCTION AND ANALYSIS\.|BOOK [IVX]+\.)$/ },
  { id: 'nicomachean-ethics', gutenberg: 8438, title: 'Nicomachean Ethics', author: 'Aristotle', translator: 'D. P. Chase', year: -340, topicId: 'philosophy', sourceId: 'nicomachean-ethics', heading: /^BOOK [IVX]+$/ },
  { id: 'analects', gutenberg: 3330, title: 'The Analects', author: 'Confucius', translator: 'James Legge', year: -479, topicId: 'philosophy', heading: /^BOOK [IVXL]+\.?.*$/ },
  { id: 'dhammapada', gutenberg: 2017, title: 'The Dhammapada', author: 'Buddhist scripture', translator: 'F. Max Müller', year: -250, topicId: 'mindfulness', heading: /^Chapter [IVXL]+\..*$/i },
  { id: 'discourse-on-method', gutenberg: 59, title: 'Discourse on the Method', author: 'René Descartes', translator: 'John Veitch', year: 1637, topicId: 'philosophy', heading: /^PART [IVX]+$/ },
  { id: 'the-prince', gutenberg: 1232, title: 'The Prince', author: 'Niccolò Machiavelli', translator: 'W. K. Marriott', year: 1532, topicId: 'leadership', heading: /^(CHAPTER [IVXL]+\.?.*|INTRODUCTION|DEDICATION)$/ },
  { id: 'zarathustra', gutenberg: 1998, title: 'Thus Spake Zarathustra', author: 'Friedrich Nietzsche', translator: 'Thomas Common', year: 1883, topicId: 'philosophy', heading: /^([IVXL]+\. [A-Z][A-Z .,'’-]+\.?|ZARATHUSTRA'S PROLOGUE\.?|INTRODUCTION BY .*|APPENDIX\.?)$/ },
  { id: 'problems-of-philosophy', gutenberg: 5827, title: 'The Problems of Philosophy', author: 'Bertrand Russell', year: 1912, topicId: 'philosophy', heading: /^(PREFACE|CHAPTER [IVX]+\..*|BIBLIOGRAPHICAL NOTE)$/ },
  { id: 'on-liberty', gutenberg: 34901, title: 'On Liberty', author: 'John Stuart Mill', year: 1859, topicId: 'philosophy', heading: /^CHAPTER [IVX]+\.?$/ },
  { id: 'walden', gutenberg: 205, title: 'Walden', author: 'Henry David Thoreau', year: 1854, topicId: 'mindfulness', heading: /^(Economy|Where I Lived, and What I Lived For|Reading|Sounds|Solitude|Visitors|The Bean-Field|The Village|The Ponds|Baker Farm|Higher Laws|Brute Neighbors|House-Warming|Former Inhabitants and Winter Visitors|Winter Animals|The Pond in Winter|Spring|Conclusion|ON THE DUTY OF CIVIL DISOBEDIENCE)$/ },
  { id: 'emerson-essays', gutenberg: 2944, title: 'Essays: First Series', author: 'Ralph Waldo Emerson', year: 1841, topicId: 'philosophy', heading: /^(HISTORY|SELF-RELIANCE|COMPENSATION|SPIRITUAL LAWS|LOVE|FRIENDSHIP|PRUDENCE|HEROISM|THE OVER-SOUL|CIRCLES|INTELLECT|ART)$/ },
  { id: 'franklin-autobiography', gutenberg: 20203, title: 'The Autobiography of Benjamin Franklin', author: 'Benjamin Franklin', year: 1791, topicId: 'history' },
  { id: 'art-of-money-getting', gutenberg: 8581, title: 'The Art of Money Getting', author: 'P. T. Barnum', year: 1880, topicId: 'money' },
  { id: 'as-a-man-thinketh', gutenberg: 4507, title: 'As a Man Thinketh', author: 'James Allen', year: 1903, topicId: 'psychology' },
  { id: '24-hours-a-day', gutenberg: 2274, title: 'How to Live on 24 Hours a Day', author: 'Arnold Bennett', year: 1908, topicId: 'productivity' },
  { id: 'common-sense', gutenberg: 147, title: 'Common Sense', author: 'Thomas Paine', year: 1776, topicId: 'history' },
  { id: 'the-prophet', gutenberg: 58585, title: 'The Prophet', author: 'Kahlil Gibran', year: 1923, topicId: 'poetry', verse: true, chunk: true },
  { id: 'gitanjali', gutenberg: 7164, title: 'Gitanjali', author: 'Rabindranath Tagore', year: 1912, topicId: 'poetry' },
  { id: 'dickinson-poems', gutenberg: 12242, title: 'Poems by Emily Dickinson', author: 'Emily Dickinson', year: 1890, topicId: 'poetry', verse: true, chunk: true },
  { id: 'pride-and-prejudice', gutenberg: 1342, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, topicId: 'relationships', heading: /^CHAPTER [IVXLC]+\.?\]?$/i },
  { id: 'frankenstein', gutenberg: 84, title: 'Frankenstein', author: 'Mary Shelley', year: 1818, topicId: 'science', heading: /^(Letter \d+|Chapter \d+)$/ },
  {
    id: 'little-brother', url: 'https://craphound.com/littlebrother/Cory_Doctorow_-_Little_Brother.txt', title: 'Little Brother', author: 'Cory Doctorow', year: 2008, topicId: 'science', sourceId: 'little-brother',
    license: 'CC BY-NC-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/3.0/', homepage: 'https://craphound.com/littlebrother/download/', heading: /^Chapter \d+$/,
  },
  {
    id: 'down-and-out', url: 'https://craphound.com/down/Cory_Doctorow_-_Down_and_Out_in_the_Magic_Kingdom.txt', title: 'Down and Out in the Magic Kingdom', author: 'Cory Doctorow', year: 2003, topicId: 'science', sourceId: 'down-and-out',
    license: 'CC BY-NC-SA 1.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/1.0/', homepage: 'https://craphound.com/down/download/', heading: /^CHAPTER \d+$/,
  },
  { id: 'alice-in-wonderland', gutenberg: 11, title: "Alice's Adventures in Wonderland", author: 'Lewis Carroll', year: 1865, topicId: 'creativity', heading: /^CHAPTER [IVXL]+\.$/ },
];

const CHUNK_CHARS = 12000;

async function download(book) {
  fs.mkdirSync(cacheDir, { recursive: true });
  const file = path.join(cacheDir, book.gutenberg ? `${book.gutenberg}.txt` : `${book.id}.txt`);
  if (fs.existsSync(file) && fs.statSync(file).size > 1000) return fs.readFileSync(file, 'utf8');
  const res = await fetch(book.url ?? `https://www.gutenberg.org/cache/epub/${book.gutenberg}/pg${book.gutenberg}.txt`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  fs.writeFileSync(file, text);
  return text;
}

/** Keep only the book between the "*** START OF" and "*** END OF" markers. */
function stripLicense(raw) {
  const text = raw.replace(/\r\n?/g, '\n').replace(/^﻿/, '');
  const start = text.search(/^\*\*\* ?START OF (THE|THIS) PROJECT GUTENBERG.*$/m);
  const end = text.search(/^\*\*\* ?END OF (THE|THIS) PROJECT GUTENBERG.*$/m);
  if (start < 0 || end < 0) throw new Error('license markers not found');
  return text.slice(text.indexOf('\n', start) + 1, end).replace(/^\s*(Produced by|E-text prepared by|Transcribed from)[^\n]*(\n[^\n]+)*\n/i, '');
}

function cleanLine(line) {
  return line.replace(/_([^_]+)_/g, '$1').replace(/\[Illustration[^\]]*\]/gi, '').replace(/\s+$/, '');
}

function toParagraphs(block, verse) {
  return block
    .split(/\n\s*\n/)
    .map((p) => {
      const lines = p.split('\n').map(cleanLine).filter((l) => l.trim());
      if (!lines.length) return '';
      return verse ? lines.map((l) => l.trim()).join('\n') : lines.map((l) => l.trim()).join(' ');
    })
    .filter((p) => p && !/^[*\s.]+$/.test(p));
}

const SKIP_TITLES = /^(contents|table of contents|illustrations|list of illustrations|transcriber'?s note|selected bibliography)\.?$/i;

const ROMAN = /^(?=[mdclxvi])m*(c[md]|d?c{0,3})(x[cl]|l?x{0,3})(i[xv]|v?i{0,3})$/i;

function headingCase(s) {
  const titled = s === s.toUpperCase() ? s.toLowerCase().replace(/(^|[\s.(-])([a-z])/g, (m, a, b) => a + b.toUpperCase()) : s;
  return titled
    .replace(/[A-Za-z]+/g, (w) => (ROMAN.test(w) ? w.toUpperCase() : w))
    .replace(/\]$/, '')
    .replace(/\s{2,}/g, ' ');
}

function splitChapters(body, book) {
  const lines = body.split('\n');
  const marks = [];
  lines.forEach((raw, i) => {
    const line = cleanLine(raw).trim();
    if (!line || line.length > 80) return;
    if (book.heading) {
      if (book.heading.test(cleanLine(raw))) marks.push(i);
      return;
    }
    // Blank-line heuristic: a short line with at least 3 blank lines above it and a blank line below.
    const blanksAbove = [1, 2, 3].every((k) => i - k >= 0 && !lines[i - k].trim());
    const blankBelow = i + 1 < lines.length && !lines[i + 1].trim();
    if (blanksAbove && blankBelow && !/[,;]$/.test(line)) marks.push(i);
  });

  let chapters = [];
  if (book.inlineHeading) return splitInline(body, book);
  if (marks.length >= 2 && !book.chunk) {
    const front = lines.slice(0, marks[0]).join('\n');
    if (front.trim().length > 1500) chapters.push({ title: 'Opening', paragraphs: toParagraphs(front, book.verse) });
    marks.forEach((m, k) => {
      const end = k + 1 < marks.length ? marks[k + 1] : lines.length;
      chapters.push({ title: headingCase(cleanLine(lines[m]).trim()), paragraphs: toParagraphs(lines.slice(m + 1, end).join('\n'), book.verse) });
    });
    // A table of contents shows up as a run of headings with almost nothing under them: drop those.
    chapters = chapters.filter((c) => c.paragraphs.join(' ').length > 120 && !SKIP_TITLES.test(c.title));
    // If a heading pattern matched both the table of contents and the text, keep the later (real) copy.
    const seen = new Map();
    chapters.forEach((c, i) => seen.set(c.title, i));
    chapters = chapters.filter((c, i) => seen.get(c.title) === i || c.paragraphs.join(' ').length > 2000);
  }

  if (chapters.length < 2) {
    // No usable headings: cut into evenly sized parts at paragraph boundaries.
    const paragraphs = toParagraphs(body, book.verse);
    chapters = [];
    let current = [];
    let size = 0;
    for (const p of paragraphs) {
      current.push(p);
      size += p.length;
      if (size > CHUNK_CHARS) {
        chapters.push({ title: `Part ${chapters.length + 1}`, paragraphs: current });
        current = [];
        size = 0;
      }
    }
    if (current.length) chapters.push({ title: `Part ${chapters.length + 1}`, paragraphs: current });
  }
  return chapters;
}

/** Chapters whose number begins a paragraph, like "Ch. 1. 1. The Tao that can be trodden...". */
function splitInline(body, book) {
  const chapters = [];
  for (const p of toParagraphs(body, book.verse)) {
    const m = p.match(book.inlineHeading);
    if (m) chapters.push({ title: `Chapter ${m[1]}`, paragraphs: [p.slice(m[0].length)] });
    else if (chapters.length) chapters[chapters.length - 1].paragraphs.push(p);
  }
  return chapters;
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const index = [];
  for (const book of BOOKS) {
    try {
      const raw = await download(book);
      // Gutenberg's own license text is dropped; an author's Creative Commons notice stays in the book.
      const body = book.gutenberg ? stripLicense(raw) : raw.replace(/\r\n?/g, '\n').replace(/^﻿/, '');
      const chapters = splitChapters(body, book);
      const words = chapters.reduce((n, c) => n + c.paragraphs.join(' ').split(/\s+/).length, 0);
      fs.writeFileSync(path.join(outDir, `${book.id}.txt`), JSON.stringify({ chapters }));
      const { heading, verse, ...meta } = book;
      index.push({ ...meta, chapters: chapters.length, words });
      console.log(`${book.id}: ${chapters.length} chapters, ${words} words | ${chapters.slice(0, 4).map((c) => c.title).join(' / ')}`);
    } catch (e) {
      console.log(`FAIL ${book.id}: ${e.message}`);
    }
  }
  // Keep the books added through books/ (scripts/build-books.js).
  const indexFile = path.join(outDir, 'index.json');
  if (fs.existsSync(indexFile)) index.push(...JSON.parse(fs.readFileSync(indexFile, 'utf8')).filter((b) => b.origin === 'books'));
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
  const assets = `// Generated by scripts/build-classics.js and scripts/build-books.js. Metro bundles each book as an asset that the reader loads on demand.\n/* eslint-disable @typescript-eslint/no-require-imports */\nexport const classicAssets: Record<string, number> = {\n${index
    .map((b) => `  '${b.id}': require('./${b.id}.txt'),`)
    .join('\n')}\n};\n`;
  fs.writeFileSync(path.join(outDir, 'assets.ts'), assets);
  console.log(`Wrote ${index.length} books to src/data/classics`);
})();
