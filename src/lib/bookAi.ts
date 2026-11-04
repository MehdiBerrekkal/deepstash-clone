import { supabase } from '@/lib/supabase';

/**
 * Asks the "book-ideas" Supabase function to have Google's Gemini (free plan) write main-idea cards, in its own
 * words, from the passages the app picked out of each part of your book. Only for signed-in accounts; the Gemini
 * key lives in the function, never in the app. Resolves to null when AI isn't available, so the app keeps the
 * picked passages instead.
 */
export type AiIdeasRequest = {
  title: string;
  author?: string;
  lang: 'en' | 'fr';
  kid?: boolean;
  parts: { title?: string; text: string }[];
};

/** Set once the function says it has no key, so the app stops asking until it's reloaded. */
let unavailable = false;

export async function aiIdeas(req: AiIdeasRequest): Promise<{ title: string; body: string }[] | null> {
  if (!supabase || unavailable || req.parts.length === 0) return null;
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  try {
    const { data, error } = await supabase.functions.invoke('book-ideas', { body: req });
    if (error) {
      // 503 = no key set yet, 404 = function not deployed: don't keep trying this session.
      const status = (error as { context?: { status?: number } }).context?.status;
      if (status === 503 || status === 404) unavailable = true;
      return null;
    }
    const ideas = (data as { ideas?: { title: string; body: string }[] })?.ideas;
    return ideas?.length ? ideas : null;
  } catch {
    return null;
  }
}
