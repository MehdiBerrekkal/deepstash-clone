export type Celebration = { emoji: string; title: string; subtitle?: string };

const listeners = new Set<(c: Celebration) => void>();

/** Confetti and a message (see CelebrationHost), e.g. when a book is finished. */
export function celebrate(c: Celebration) {
  for (const l of listeners) l(c);
}

export function onCelebrate(listener: (c: Celebration) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
