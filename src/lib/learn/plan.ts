import type { Course, LItem, Unit } from '@/data/learn/courses';
import type { Dialogue, FullCourse, Grammar, Level, Story, Topic, Word } from '@/data/learn/full';

/**
 * A course as a path: a Basics section (alphabet, sounds, first words), then CEFR levels A1 → B1. Each level is a
 * series of units (topics, grammar, role-plays, stories), each split into 4–6 short lessons, and ends with a
 * checkpoint that opens the next level.
 */

export type LessonKind = 'basic' | 'words1' | 'words2' | 'context' | 'speak' | 'review' | 'notes' | 'drill' | 'roleplay' | 'story' | 'checkpoint';
export type Lesson = { id: string; kind: LessonKind; title: { en: string; fr: string } };
export type PlanUnit = {
  id: string;
  section: string;
  icon: string;
  title: { en: string; fr: string };
  can: { en: string; fr: string };
  type: 'basics' | 'topic' | 'grammar' | 'dialogue' | 'story' | 'checkpoint';
  lessons: Lesson[];
  basic?: Unit;
  topic?: Topic;
  grammar?: Grammar;
  dialogue?: Dialogue;
  story?: Story;
};
export type Section = { id: string; title: { en: string; fr: string }; level?: Level; units: PlanUnit[] };

const L = (id: string, kind: LessonKind, en: string, fr: string): Lesson => ({ id, kind, title: { en, fr } });
const LEVELS: { id: Level; en: string; fr: string }[] = [
  { id: 'A1', en: 'A1 · Beginner', fr: 'A1 · Débutant' },
  { id: 'A2', en: 'A2 · Elementary', fr: 'A2 · Élémentaire' },
  { id: 'B1', en: 'B1 · Intermediate', fr: 'B1 · Intermédiaire' },
];

export function wordItem(w: Word, key?: string): LItem {
  return { key, text: w.text, roman: '', en: w.en, fr: w.fr, emoji: w.emoji, ex: w.ex, exEn: w.exEn, exFr: w.exFr };
}

export function buildPlan(course: Course, full: FullCourse | null): Section[] {
  const basics: Section = {
    id: 'basics',
    title: { en: 'Basics', fr: 'Les bases' },
    units: course.units.map((u) => ({ id: u.id, section: 'basics', icon: u.icon, title: u.title, can: u.can, type: 'basics', basic: u, lessons: [L('play', 'basic', 'Lesson', 'Leçon')] })),
  };
  if (!full) return [basics];
  const sections: Section[] = [basics];
  for (const lv of LEVELS) {
    const topics = full.topics.filter((t) => t.level === lv.id);
    if (!topics.length) continue;
    const grammar = full.grammar.filter((g) => g.level === lv.id);
    const dialogues = full.dialogues.filter((d) => d.level === lv.id);
    const stories = full.stories.filter((s) => s.level === lv.id);
    const units: PlanUnit[] = [];
    topics.forEach((t, i) => {
      units.push({
        id: t.id, section: lv.id, icon: t.icon, title: { en: t.en, fr: t.fr }, type: 'topic', topic: t,
        can: { en: `Talk about: ${t.en.toLowerCase()}`, fr: `Parler de : ${t.fr.toLowerCase()}` },
        lessons: [
          L('w1', 'words1', 'New words 1', 'Nouveaux mots 1'),
          L('w2', 'words2', 'New words 2', 'Nouveaux mots 2'),
          L('ctx', 'context', 'In context', 'En contexte'),
          L('speak', 'speak', 'Speak and write', 'Parler et écrire'),
          L('rev', 'review', 'Review', 'Révision'),
        ],
      });
      // Grammar after every second topic; role-plays and stories spread through the level.
      if (i % 2 === 1 && grammar.length) {
        const g = grammar.shift()!;
        units.push({ id: g.id, section: lv.id, icon: g.icon, title: { en: g.en, fr: g.fr }, type: 'grammar', grammar: g, can: { en: `Use: ${g.en}`, fr: `Utiliser : ${g.fr}` }, lessons: [L('notes', 'notes', 'How it works', 'Comment ça marche'), L('drill', 'drill', 'Practice', 'Entraînement'), L('drill2', 'drill', 'Master it', 'Maîtriser')] });
      }
      if (i % 3 === 2 && dialogues.length) {
        const d = dialogues.shift()!;
        units.push({ id: d.id, section: lv.id, icon: d.icon, title: { en: d.en, fr: d.fr }, type: 'dialogue', dialogue: d, can: { en: d.en, fr: d.fr }, lessons: [L('play', 'roleplay', 'Role-play', 'Jeu de rôle'), L('again', 'roleplay', 'Say it yourself', 'À vous de parler')] });
      }
    });
    for (const g of grammar) units.push({ id: g.id, section: lv.id, icon: g.icon, title: { en: g.en, fr: g.fr }, type: 'grammar', grammar: g, can: { en: `Use: ${g.en}`, fr: `Utiliser : ${g.fr}` }, lessons: [L('notes', 'notes', 'How it works', 'Comment ça marche'), L('drill', 'drill', 'Practice', 'Entraînement'), L('drill2', 'drill', 'Master it', 'Maîtriser')] });
    for (const d of dialogues) units.push({ id: d.id, section: lv.id, icon: d.icon, title: { en: d.en, fr: d.fr }, type: 'dialogue', dialogue: d, can: { en: d.en, fr: d.fr }, lessons: [L('play', 'roleplay', 'Role-play', 'Jeu de rôle'), L('again', 'roleplay', 'Say it yourself', 'À vous de parler')] });
    for (const s of stories) units.push({ id: s.id, section: lv.id, icon: s.icon, title: { en: s.en, fr: s.fr }, type: 'story', story: s, can: { en: `Read a short story (${lv.id})`, fr: `Lire une petite histoire (${lv.id})` }, lessons: [L('read', 'story', 'Read', 'Lire')] });
    units.push({ id: `${course.id}-${lv.id}-check`, section: lv.id, icon: '🏁', title: { en: `${lv.id} checkpoint`, fr: `Validation ${lv.id}` }, type: 'checkpoint', can: { en: `Pass level ${lv.id}`, fr: `Valider le niveau ${lv.id}` }, lessons: [L('test', 'checkpoint', 'Checkpoint test', 'Test de validation')] });
    sections.push({ id: lv.id, level: lv.id, title: { en: lv.en, fr: lv.fr }, units });
  }
  return sections;
}

/** Progress keys: one per lesson. */
export const lessonKey = (course: Course, unit: PlanUnit, lesson: Lesson) => (lesson.kind === 'basic' ? unit.id : `${course.id}:${unit.id}:${lesson.id}`);
/** Key of a course word, for spaced review. */
export const wordKey = (course: Course, topic: Topic, w: Word) => `${course.id}:${topic.id}:${w.text}`;

/** Lessons in path order, for "next". */
export const flatLessons = (sections: Section[]) => sections.flatMap((s, si) => s.units.flatMap((u) => u.lessons.map((l) => ({ si, unit: u, lesson: l }))));

/** A section opens when the previous one's checkpoint is passed (Basics is always open, and so is A1). */
export function sectionOpen(course: Course, sections: Section[], i: number, done: (key: string) => number) {
  if (i <= 1) return true;
  const prev = sections[i - 1];
  const check = prev.units.find((u) => u.type === 'checkpoint');
  return !check || done(lessonKey(course, check, check.lessons[0])) >= 2;
}

/** The first lesson not yet done in the course, in path order (for "Continue"). */
export function nextLesson(course: Course, sections: Section[], done: (key: string) => number) {
  for (let i = 0; i < sections.length; i++) {
    if (!sectionOpen(course, sections, i, done)) break;
    for (const u of sections[i].units) for (const l of u.lessons) if (!done(lessonKey(course, u, l))) return { unit: u, lesson: l };
  }
  return null;
}
