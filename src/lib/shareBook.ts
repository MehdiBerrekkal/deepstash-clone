import type { Classic } from '@/lib/fullbook';
import type { OwnBook } from '@/lib/ownbooks';
import { APP_URL, blurb, shareMessage } from '@/lib/share';
import type { Source } from '@/lib/types';

const by = (title: string, author: string) => (author && author !== 'PDF' ? `${title}, by ${author}` : title);

/** A full book from the app's library: the link opens its page, where it reads for free. */
export function shareClassic(c: Classic) {
  const text = [by(c.title, c.author), blurb(c.description), 'Read the whole book free on DeepStach:'].filter(Boolean).join('\n\n');
  return shareMessage(c.title, text, `${APP_URL}/classic/${encodeURIComponent(c.id)}`);
}

/** A book with key ideas: the link opens its page and its cards. */
export function shareSource(s: Source, ideaCount?: number) {
  const intro = ideaCount ? `Its ${ideaCount} key ideas in a few minutes on DeepStach:` : 'On DeepStach:';
  const text = [by(s.title, s.author), blurb(s.description), intro].filter(Boolean).join('\n\n');
  return shareMessage(s.title, text, `${APP_URL}/book/${encodeURIComponent(s.id)}`);
}

/**
 * One of your own books. A free public-domain book you downloaded: the link finds it in the same free library, so
 * the other person gets it in one tap. Any other book: the message names it and links to the app (the file stays
 * with you).
 */
export function shareOwn(b: OwnBook) {
  if (b.source) {
    const text = [by(b.title, b.author), blurb(b.description), `It’s free (public domain, from ${b.source}). Get it in one tap on DeepStach:`].filter(Boolean).join('\n\n');
    return shareMessage(b.title, text, `${APP_URL}/find?q=${encodeURIComponent(`${b.title} ${b.author}`.trim())}`);
  }
  const text = [by(b.title, b.author), blurb(b.description), 'I’m reading it on DeepStach, with its main ideas as cards:'].filter(Boolean).join('\n\n');
  return shareMessage(b.title, text, `${APP_URL}/`);
}
