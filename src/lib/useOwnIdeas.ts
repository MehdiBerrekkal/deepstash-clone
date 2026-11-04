import { useEffect, useRef } from 'react';

import { aiIdeas } from '@/lib/bookAi';
import type { FullBook } from '@/lib/fullbook';
import { loadSavedBook, type OwnBook } from '@/lib/ownbooks';
import { makeOwnIdeas, OWN_IDEAS_VERSION } from '@/lib/ownIdeas';
import { useStore } from '@/lib/store';

/** Books asked of the AI this session, so a failure isn't retried in a loop. */
const askedAi = new Set<string>();

/** Gemini's free plan is often busy for a moment: try again after 1 and 3 minutes while the app stays open. */
const RETRY_MS = [60_000, 180_000];
async function askWithRetries(ask: () => ReturnType<typeof aiIdeas>) {
  let res = await ask();
  for (const wait of RETRY_MS) {
    if (!('error' in res) || !/busy|didn’t answer|limit/i.test(res.error)) break;
    await new Promise((r) => setTimeout(r, wait));
    res = await ask();
  }
  return res;
}

type BookRef = Pick<OwnBook, 'id' | 'title' | 'author' | 'ideasBy' | 'ideas'>;

/**
 * Makes and saves the idea cards for one book: first the passages the app picks itself (instant, offline), then,
 * for signed-in accounts, cards written by AI in its own words, which replace them when they arrive.
 * Returns how many cards it made straight away, and a promise of the AI step (an error message, or null when it worked).
 */
export function useMakeOwnIdeas() {
  const { setOwnBookIdeas, audience, account } = useStore();
  return (book: BookRef, text: FullBook, opts: { manual?: boolean } = {}): { count: number; ai: Promise<string | null> } => {
    const kid = audience === 'kid';
    const r = makeOwnIdeas(text, { kid });
    if (book.ideasBy !== 'ai' || !book.ideas?.length) {
      setOwnBookIdeas(book.id, { ideas: r.ideas, ideasVersion: OWN_IDEAS_VERSION, ideasBy: 'picked', description: r.description, topicId: r.topicId, lang: r.lang });
    }
    if (!opts.manual && (!account || askedAi.has(book.id))) return { count: r.ideas.length, ai: Promise.resolve(account ? null : 'Sign in to have AI write the cards.') };
    askedAi.add(book.id);
    const req = { title: book.title, author: book.author === 'PDF' ? undefined : book.author, lang: r.lang, kid, parts: r.passages };
    const ai = askWithRetries(() => aiIdeas(req, opts)).then((res) => {
      if ('error' in res) return res.error;
      const description =
        r.lang === 'fr'
          ? `${res.ideas.length} idées principales de votre livre, résumées par l'IA (Google Gemini) dans ses propres mots.`
          : `${res.ideas.length} main ideas from your book, summarised in its own words by AI (Google Gemini).`;
      setOwnBookIdeas(book.id, { ideas: res.ideas, ideasVersion: OWN_IDEAS_VERSION, ideasBy: 'ai', description, topicId: r.topicId, lang: r.lang });
      return null;
    });
    return { count: r.ideas.length, ai };
  };
}

/** A book still needs cards made: none yet, an older method, or only picked passages when AI could write them. */
export const needsIdeas = (b: OwnBook, aiPossible = false) =>
  !b.ideas?.length || (b.ideasVersion ?? 0) < OWN_IDEAS_VERSION || (aiPossible && b.ideasBy !== 'ai' && !askedAi.has(b.id));

/**
 * Makes idea cards for your EPUBs (and books found with "Find a book") that don't have them yet, e.g. ones added
 * before this feature, and upgrades them to AI-written cards once you're signed in. PDFs get theirs when opened,
 * since their text comes from the PDF engine.
 */
export function useOwnIdeasBackfill() {
  const { ownBooks, ready, account } = useStore();
  const make = useMakeOwnIdeas();
  const tried = useRef(new Set<string>());
  useEffect(() => {
    if (!ready) return;
    const todo = ownBooks.filter((b) => b.kind === 'epub' && needsIdeas(b, !!account) && !tried.current.has(`${b.id}:${!!account}`));
    if (!todo.length) return;
    let alive = true;
    (async () => {
      for (const b of todo) {
        tried.current.add(`${b.id}:${!!account}`);
        const text = await loadSavedBook(b.id).catch(() => null);
        if (!alive) return;
        if (text) make(b, text);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownBooks, ready, account]);
}
