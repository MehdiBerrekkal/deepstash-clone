import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

import { parseEpub } from '@/lib/epub';
import { webStore } from '@/lib/webStore';
import type { FullBook } from '@/lib/fullbook';

/**
 * Books the user opens from their own device. Files never leave the device: on iOS and Android they're
 * kept in the app's private documents folder; on the web, EPUB text is kept in browser storage and PDFs
 * only for the current session.
 */
export type OwnBook = {
  id: string;
  kind: 'epub' | 'pdf';
  fileName: string;
  title: string;
  author: string;
  addedAt: string;
  /** Native: where the PDF copy lives. */
  uri?: string;
  /** Book language ("en", "fr"), for reading aloud. */
  lang?: string;
  /** Where a book found with "Find a book" came from, e.g. "Project Gutenberg". */
  source?: string;
  /** Its page on that site. */
  sourceUrl?: string;
};

const WEB_KEY = (id: string) => `deepstash-clone/own-book/${id}`;
const PDF_KEY = (id: string) => `deepstash-clone/own-pdf/${id}`;
const memory = new Map<string, FullBook>();
const webPdfUrls = new Map<string, string>();

function folder(): Directory {
  const dir = new Directory(Paths.document, 'own-books');
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

async function readBytes(asset: DocumentPicker.DocumentPickerAsset): Promise<ArrayBuffer | Uint8Array> {
  if (Platform.OS === 'web') {
    if (asset.file) return asset.file.arrayBuffer();
    return (await fetch(asset.uri)).arrayBuffer();
  }
  return new File(asset.uri).bytes();
}

/** Shows the system file picker. Resolves to null if the user cancels. */
export async function pickOwnBook(): Promise<OwnBook | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/epub+zip', 'application/pdf', '.epub', '.pdf'],
    copyToCacheDirectory: true,
    base64: false,
  });
  if (result.canceled || !result.assets?.[0]) return null;
  const asset = result.assets[0];
  const name = asset.name ?? 'book';
  const isPdf = asset.mimeType === 'application/pdf' || /\.pdf$/i.test(name);
  const isEpub = asset.mimeType === 'application/epub+zip' || /\.epub$/i.test(name);
  if (!isPdf && !isEpub) throw new Error('Pick an EPUB or PDF file.');
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const addedAt = new Date().toISOString();

  if (isPdf) {
    const title = name.replace(/\.pdf$/i, '');
    if (Platform.OS === 'web') {
      webPdfUrls.set(id, asset.file ? URL.createObjectURL(asset.file) : asset.uri);
      // Keep the bytes in IndexedDB so the PDF is still there after the tab is closed.
      await webStore.set(PDF_KEY(id), await readBytes(asset).then((b) => (b instanceof Uint8Array ? b.slice().buffer : b)));
      return { id, kind: 'pdf', fileName: name, title, author: 'PDF', addedAt };
    }
    const dest = new File(folder(), `${id}.pdf`);
    new File(asset.uri).copy(dest);
    return { id, kind: 'pdf', fileName: name, title, author: 'PDF', addedAt, uri: dest.uri };
  }

  const book = await parseEpub(await readBytes(asset), name);
  await saveBook(id, book);
  return { id, kind: 'epub', fileName: name, title: book.title, author: book.author, addedAt };
}

/** Keeps a parsed book on the device: in the app's documents folder on iOS and Android, browser storage on the web. */
export async function saveBook(id: string, book: FullBook): Promise<void> {
  memory.set(id, book);
  const json = JSON.stringify(book);
  if (Platform.OS === 'web') {
    // IndexedDB holds whole books; if the browser blocks it, the book stays readable until the page is closed.
    await webStore.set(WEB_KEY(id), json);
  } else {
    await new File(folder(), `${id}.json`).write(json);
  }
}

export async function loadSavedBook(id: string): Promise<FullBook | null> {
  if (memory.has(id)) return memory.get(id)!;
  let json: string | null = null;
  // Older versions kept small EPUBs in localStorage; still read those.
  if (Platform.OS === 'web') json = (await webStore.get(WEB_KEY(id))) ?? (await AsyncStorage.getItem(WEB_KEY(id)).catch(() => null));
  else {
    const file = new File(folder(), `${id}.json`);
    if (file.exists) json = await file.text();
  }
  if (!json) return null;
  const book = JSON.parse(json) as FullBook;
  memory.set(id, book);
  return book;
}

export const loadOwnBook = loadSavedBook;

/** The raw bytes of one of the user's PDFs, as the PDF engine wants them (base64 on native, bytes on the web). */
export async function loadPdfData(book: OwnBook): Promise<{ base64?: string; bytes?: ArrayBuffer }> {
  if (Platform.OS === 'web') {
    const stored = await webStore.get<ArrayBuffer>(PDF_KEY(book.id));
    if (stored) return { bytes: stored };
    const url = webPdfUrls.get(book.id);
    if (url) return { bytes: await (await fetch(url)).arrayBuffer() };
    throw new Error('This PDF is no longer stored in this browser. Open the file again from the Library.');
  }
  if (!book.uri || !new File(book.uri).exists) throw new Error('This PDF is no longer on the device. Open the file again from the Library.');
  return { base64: await new File(book.uri).base64() };
}

/** Web only: the object URL of a PDF picked in this session. */
export function webPdfUrl(id: string): string | undefined {
  return webPdfUrls.get(id);
}

/** Opens a PDF in the system viewer (Quick Look on iOS, the default PDF app on Android). */
export async function previewPdf(book: OwnBook): Promise<void> {
  if (!book.uri) throw new Error('This PDF is no longer on the device.');
  const file = new File(book.uri);
  if (!file.exists) throw new Error('This PDF is no longer on the device.');
  await file.preview({ title: book.title });
}

export async function deleteOwnBookFiles(book: OwnBook): Promise<void> {
  memory.delete(book.id);
  if (Platform.OS === 'web') {
    await webStore.remove(WEB_KEY(book.id));
    await webStore.remove(PDF_KEY(book.id));
    await AsyncStorage.removeItem(WEB_KEY(book.id)).catch(() => {});
    const url = webPdfUrls.get(book.id);
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    webPdfUrls.delete(book.id);
    return;
  }
  for (const name of [`${book.id}.json`, `${book.id}.pdf`]) {
    const file = new File(folder(), name);
    if (file.exists) file.delete();
  }
}
