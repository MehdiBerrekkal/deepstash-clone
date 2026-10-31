import * as Clipboard from 'expo-clipboard';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform, Share } from 'react-native';

import type { Highlight } from '@/lib/types';

export const copyText = (text: string) => Clipboard.setStringAsync(text).catch(() => false);

/** Saves a file in the browser by clicking a temporary download link. */
function download(name: string, href: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Shares a text file (e.g. Markdown) through the share sheet, or downloads it on the web. */
export async function shareTextFile(name: string, text: string, mimeType = 'text/markdown') {
  if (Platform.OS === 'web') {
    const url = URL.createObjectURL(new Blob([text], { type: mimeType }));
    download(name, url);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return;
  }
  if (!(await Sharing.isAvailableAsync())) {
    await Share.share({ message: text });
    return;
  }
  const file = new File(Paths.cache, name);
  if (file.exists) file.delete();
  file.create();
  file.write(text);
  await Sharing.shareAsync(file.uri, { mimeType, dialogTitle: name });
}

/** Shares a captured image (a file URI on phones, a data URI on the web). */
export async function shareImage(uri: string, name = 'quote.png') {
  if (Platform.OS === 'web') {
    // Phones get the system share sheet (when the browser can share files); computers download the PNG.
    const touch = globalThis.matchMedia?.('(pointer: coarse)').matches;
    try {
      if (!touch) throw new Error('download');
      const blob = await (await fetch(uri)).blob();
      const file = new globalThis.File([blob], name, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
        return;
      }
    } catch {
      // fall through to a download
    }
    download(name, uri);
    return;
  }
  await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share quote' });
}

/** Highlights as Markdown, grouped by book and in reading order. */
export function highlightsMarkdown(highlights: Highlight[], title = 'Highlights') {
  const byBook = new Map<string, Highlight[]>();
  for (const h of highlights) byBook.set(h.readerId, [...(byBook.get(h.readerId) ?? []), h]);
  const out = [`# ${title}`, ''];
  for (const list of byBook.values()) {
    list.sort((a, b) => a.chapter - b.chapter || a.para - b.para || a.char - b.char);
    out.push(`## ${list[0].bookTitle}`, `*${list[0].author}*`, '');
    let chapter = '';
    for (const h of list) {
      if (h.chapterTitle && h.chapterTitle !== chapter) {
        chapter = h.chapterTitle;
        out.push(`### ${chapter}`, '');
      }
      out.push(`> ${h.text.replace(/\n/g, '\n> ')}`, '');
      if (h.note) out.push(`**Note:** ${h.note}`, '');
    }
  }
  return out.join('\n');
}
