import type { Idea, Source, SourceKind, Topic } from '@/lib/types';

import business from './library/business.json';
import career from './library/career.json';
import communication from './library/communication.json';
import creativity from './library/creativity.json';
import health from './library/health.json';
import history from './library/history.json';
import leadership from './library/leadership.json';
import mindfulness from './library/mindfulness.json';
import money from './library/money.json';
import philosophy from './library/philosophy.json';
import productivity from './library/productivity.json';
import psychology from './library/psychology.json';
import relationships from './library/relationships.json';
import science from './library/science.json';
import covers from './covers.json';
import facts from './facts.json';
import poems from './poems.json';
import quotes from './quotes.json';

type LibraryFile = {
  topic: Topic;
  books: {
    id: string;
    title: string;
    author: string;
    kind: string;
    year?: number;
    description: string;
    /** [title, body] or [title, body, id] when the idea needs a stable legacy id. */
    ideas: string[][];
  }[];
};

export type Content = {
  topics: Topic[];
  sources: Source[];
  ideas: Idea[];
};

const POETRY: Topic = { id: 'poetry', name: 'Poetry', emoji: '🪶', color: '#5B3A6B' };

const library = [
  productivity, psychology, philosophy, mindfulness, money, health, creativity,
  leadership, business, communication, relationships, science, history, career,
] as LibraryFile[];

const coverIds = covers as Record<string, number>;

function slug(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
}

function build(): Content {
  const topics = [...library.map((f) => f.topic), POETRY];
  const sources: Source[] = [];
  const ideas: Idea[] = [];

  for (const { topic, books } of library) {
    for (const book of books) {
      sources.push({
        id: book.id,
        title: book.title,
        author: book.author,
        kind: book.kind as SourceKind,
        topicId: topic.id,
        description: book.description,
        year: book.year,
        coverId: coverIds[book.id],
      });
      book.ideas.forEach(([title, body, id], i) => {
        ideas.push({ id: id ?? `${book.id}-${i + 1}`, kind: 'idea', topicId: topic.id, sourceId: book.id, title, body });
      });
    }
  }

  quotes.forEach((q, i) => {
    ideas.push({ id: `quote-${i + 1}-${slug(q.author)}`, kind: 'quote', topicId: q.topic, title: '', body: q.text, author: q.author, cite: q.cite });
  });
  for (const p of poems) {
    ideas.push({ id: `poem-${slug(p.title)}`, kind: 'poem', topicId: POETRY.id, title: p.title, body: p.text, author: p.author, year: p.year });
  }
  for (const f of facts) {
    ideas.push({ id: `fact-${slug(f.title)}`, kind: 'fact', topicId: f.topic, title: f.title, body: f.body });
  }

  return { topics, sources, ideas };
}

export const bundledContent: Content = build();
