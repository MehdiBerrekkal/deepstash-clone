import covers from '@/data/covers.json';
import type { Classic } from '@/lib/fullbook';
import type { Source } from '@/lib/types';

const coverIds = covers as Record<string, number>;

/** Lets BookCover draw a full classic like any library book. */
export function classicAsSource(c: Classic): Source {
  return {
    id: c.id,
    title: c.title,
    author: c.author,
    kind: 'book',
    topicId: c.topicId,
    description: '',
    year: c.year,
    coverId: coverIds[`classic:${c.id}`],
  };
}
