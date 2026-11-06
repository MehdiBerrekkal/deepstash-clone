import type { FullCourse } from '@/data/learn/full';

/** Full A1 → B1 content, loaded only when a course is opened (each language is its own download). */
const LOADERS: Record<string, () => Promise<FullCourse>> = {
  es: () => import('@/data/learn/es-full').then((m) => m.SPANISH_FULL),
};

const cache = new Map<string, Promise<FullCourse | null>>();
export function loadFull(courseId: string): Promise<FullCourse | null> {
  if (!cache.has(courseId)) cache.set(courseId, LOADERS[courseId] ? LOADERS[courseId]().catch(() => null) : Promise.resolve(null));
  return cache.get(courseId)!;
}
export const hasFull = (courseId: string) => !!LOADERS[courseId];
