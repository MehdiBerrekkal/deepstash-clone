import { useEffect, useRef } from 'react';

import type { FullBook } from '@/lib/fullbook';
import { loadSavedBook, type OwnBook } from '@/lib/ownbooks';
import { makeOwnIdeas, OWN_IDEAS_VERSION } from '@/lib/ownIdeas';
import { useStore } from '@/lib/store';

/** Makes and saves the idea cards for one book. Returns how many cards it made. */
export function useMakeOwnIdeas() {
  const { setOwnBookIdeas, audience } = useStore();
  return (book: Pick<OwnBook, 'id'>, text: FullBook): number => {
    const r = makeOwnIdeas(text, { kid: audience === 'kid' });
    setOwnBookIdeas(book.id, { ideas: r.ideas, ideasVersion: OWN_IDEAS_VERSION, description: r.description, topicId: r.topicId, lang: r.lang });
    return r.ideas.length;
  };
}

export const needsIdeas = (b: OwnBook) => !b.ideas?.length || (b.ideasVersion ?? 0) < OWN_IDEAS_VERSION;

/**
 * Makes idea cards for your EPUBs (and books found with "Find a book") that don't have them yet, e.g. ones added
 * before this feature. PDFs get theirs the first time they're opened, since their text comes from the PDF engine.
 */
export function useOwnIdeasBackfill() {
  const { ownBooks, ready } = useStore();
  const make = useMakeOwnIdeas();
  const tried = useRef(new Set<string>());
  useEffect(() => {
    if (!ready) return;
    const todo = ownBooks.filter((b) => b.kind === 'epub' && needsIdeas(b) && !tried.current.has(b.id));
    if (!todo.length) return;
    let alive = true;
    (async () => {
      for (const b of todo) {
        tried.current.add(b.id);
        const text = await loadSavedBook(b.id).catch(() => null);
        if (!alive) return;
        if (text) make(b, text);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownBooks, ready]);
}
