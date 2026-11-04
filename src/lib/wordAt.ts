import { Platform } from 'react-native';

/** The reader's paragraphs carry this data attribute, so a long-press can find the word under the finger. */
export const WORD_TAP_ATTR = 'wordtap';

/**
 * On iPhone Safari a long-press on text normally starts the system text selection and its callout menu, which would
 * swallow our own long-press. Turn both off for the reader's paragraphs only.
 */
if (Platform.OS === 'web' && typeof document !== 'undefined' && !document.getElementById('wordtap-style')) {
  const style = document.createElement('style');
  style.id = 'wordtap-style';
  style.textContent = `[data-${WORD_TAP_ATTR}], [data-${WORD_TAP_ATTR}] * {
    -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; -webkit-tap-highlight-color: transparent;
  }`;
  document.head.appendChild(style);
}

const WORD = /[\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*/gu;
/** How far (px) from a word a press still counts as on it. */
const SLOP = 10;

type Point = { pageX?: number; pageY?: number; touches?: ArrayLike<{ pageX: number; pageY: number }> };

/**
 * The word under a long-press in the web build, or null (a native build, or the press landed between words).
 * Works on the paragraph's own text nodes, so highlight runs that split a word don't matter.
 */
export function wordAtPress(event: { nativeEvent?: Point }): string | null {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return null;
  const n = event.nativeEvent;
  const pageX = n?.pageX ?? n?.touches?.[0]?.pageX;
  const pageY = n?.pageY ?? n?.touches?.[0]?.pageY;
  if (pageX == null || pageY == null) return null;
  const x = pageX - window.scrollX;
  const y = pageY - window.scrollY;
  const container = document.elementFromPoint(x, y)?.closest(`[data-${WORD_TAP_ATTR}]`);
  if (!container) return null;

  // Every text node with its offset in the paragraph's full text.
  const nodes: { node: Text; start: number }[] = [];
  let full = '';
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  for (let t = walker.nextNode() as Text | null; t; t = walker.nextNode() as Text | null) {
    nodes.push({ node: t, start: full.length });
    full += t.data;
  }
  const locate = (offset: number, end: boolean) => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const { node, start } = nodes[i];
      if (offset > start || (offset === start && !end)) return { node, at: Math.min(offset - start, node.data.length) };
    }
    return { node: nodes[0].node, at: 0 };
  };
  if (!nodes.length) return null;

  let best: { word: string; dist: number } | null = null;
  const range = document.createRange();
  for (const m of full.matchAll(WORD)) {
    const a = locate(m.index, false);
    const b = locate(m.index + m[0].length, true);
    range.setStart(a.node, a.at);
    range.setEnd(b.node, b.at);
    for (const r of Array.from(range.getClientRects())) {
      const dx = Math.max(r.left - x, 0, x - r.right);
      const dy = Math.max(r.top - y, 0, y - r.bottom);
      const dist = Math.hypot(dx, dy);
      if (dist <= SLOP && (!best || dist < best.dist)) best = { word: m[0], dist };
    }
    if (best?.dist === 0) break;
  }
  range.detach?.();
  return best?.word ?? null;
}
