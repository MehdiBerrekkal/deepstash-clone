import { useEffect, useRef } from 'react';

import { aiIdeas } from '@/lib/bookAi';
import type { FullBook } from '@/lib/fullbook';
import { loadSavedBook, type OwnBook } from '@/lib/ownbooks';
import { makeOwnIdeas, OWN_IDEAS_VERSION } from '@/lib/ownIdeas';
import { useStore } from '@/lib/store';

/** Books asked of the AI this session, so a failure isn't retried in a loop. */
const askedAi = new Set<string>();

/**
 * Makes and saves the idea cards for one book: first the passages the app picks itself (instant, offline), then,
 * for signed-in accounts, cards written by AI in its own words, which replace them when they arrive.
 * Returns how many cards it made straight away.
 */
export function useMakeOwnIdeas() {
  const { setOwnBookIdeas, audience, account } = useStore();
  return (book: Pick<OwnBook, 'id' | 'title' | 'author' | 'ideasBy' | 'ideas'>, text: FullBook): number => {
    const kid = audience === 'kid';
    const r = makeOwnIdeas(text, { kid });
    if (book.ideasBy !== 'ai' || !book.ideas?.length) {
      setOwnBookIdeas(book.id, { ideas: r.ideas, ideasVersion: OWN_IDEAS_VERSION, ideasBy: 'picked', description: r.description, topicId: r.topicId, lang: r.lang });
    }
    if (account && !askedAi.has(book.id) && r.passages.length) {
      askedAi.add(book.id);
      aiIdeas({ title: book.title, author: book.author === 'PDF' ? undefined : book.author, lang: r.lang, kid, parts: r.passages }).then((ideas) => {
        if (!ideas) return;
        const description =
          r.lang === 'fr'
            ? `${ideas.length} idées principales de votre livre, résumées par l'IA (Google Gemini) dans ses propres mots.`
            : `${ideas.length} main ideas from your book, summarised in its own words by AI (Google Gemini).`;
        setOwnBookIdeas(book.id, { ideas, ideasVersion: OWN_IDEAS_VERSION, ideasBy: 'ai', description, topicId: r.topicId, lang: r.lang });
      });
    }
    return r.ideas.length;
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
