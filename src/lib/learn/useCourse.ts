import { useEffect, useMemo, useState } from 'react';

import type { Course } from '@/data/learn/courses';
import type { FullCourse } from '@/data/learn/full';
import { loadFull } from '@/lib/learn/fullCourses';
import { buildPlan, flatLessons, lessonKey, nextLesson, sectionOpen, type Section } from '@/lib/learn/plan';
import { useStore } from '@/lib/store';

/** A course's path with the learner's progress: sections, what's done, what's next, the current level. */
export function useCoursePath(course: Course) {
  const { learn } = useStore();
  const [loaded, setLoaded] = useState<{ id: string; full: FullCourse | null } | null>(null);
  useEffect(() => {
    let live = true;
    void loadFull(course.id).then((f) => live && setLoaded({ id: course.id, full: f }));
    return () => {
      live = false;
    };
  }, [course.id]);
  const full = loaded?.id === course.id ? loaded.full : null;
  const ready = loaded?.id === course.id;
  const sections: Section[] = useMemo(() => buildPlan(course, full), [course, full]);
  const units = learn?.units;
  const items = learn?.items;
  return useMemo(() => {
    const done = (k: string) => units?.[k]?.stars ?? 0;
    const flat = flatLessons(sections);
    const doneCount = flat.filter((x) => done(lessonKey(course, x.unit, x.lesson)) > 0).length;
    const open = sections.map((_, i) => sectionOpen(course, sections, i, done));
    // Current level: the last open CEFR section.
    const level = [...sections].reverse().find((s, k) => s.level && open[sections.length - 1 - k])?.level;
    const known = Object.entries(items ?? {}).filter(([k, v]) => k.startsWith(`${course.id}:`) && v.level >= 1).length;
    return { full, ready, sections, done, flat, doneCount, open, level, known, next: nextLesson(course, sections, done) };
  }, [course, full, ready, sections, units, items]);
}
