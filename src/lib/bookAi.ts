import { supabase } from '@/lib/supabase';

/**
 * Asks the "book-ideas" Supabase function to have Google's Gemini (free plan) write main-idea cards, in its own
 * words, from the passages the app picked out of each part of your book. Only for signed-in accounts; the Gemini
 * key lives in the function, never in the app. When AI isn't available it says why, and the app keeps the
 * picked passages.
 */
export type AiIdeasRequest = {
  title: string;
  author?: string;
  lang: 'en' | 'fr';
  kid?: boolean;
  parts: { title?: string; text: string }[];
};

export type AiIdeasResult = { ideas: { title: string; body: string }[] } | { error: string };

/** Set once the function says it has no key, so automatic tries stop until the app is reloaded. */
let unavailable = false;

const REASONS: Record<string, string> = {
  not_configured: 'The Gemini key isn’t set up yet (Supabase → Edge Functions → Secrets → GEMINI_API_KEY).',
  sign_in: 'Sign in to your account to have AI write the cards.',
  busy: 'Gemini’s free limit is used up for now. Try again in a minute.',
  failed: 'Gemini didn’t answer. Try again in a moment.',
  bad_request: 'This book has no text the AI can read.',
};

export async function aiIdeas(req: AiIdeasRequest, opts: { manual?: boolean } = {}): Promise<AiIdeasResult> {
  if (!supabase) return { error: 'Accounts aren’t set up in this version of the app.' };
  if (unavailable && !opts.manual) return { error: REASONS.not_configured };
  if (req.parts.length === 0) return { error: REASONS.bad_request };
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return { error: REASONS.sign_in };
  try {
    const { data, error } = await supabase.functions.invoke('book-ideas', { body: req });
    if (error) {
      const res = (error as { context?: Response }).context;
      const status = res?.status;
      let code = '';
      try {
        code = ((await res?.json()) as { error?: string })?.error ?? '';
      } catch {}
      if (status === 503 || status === 404) unavailable = true;
      if (status === 404) return { error: 'The AI function isn’t deployed.' };
      return { error: REASONS[code] ?? (status ? `${REASONS.failed} (error ${status})` : 'No connection to the AI. Check your internet.') };
    }
    const ideas = (data as { ideas?: { title: string; body: string }[] })?.ideas;
    return ideas?.length ? { ideas } : { error: REASONS.failed };
  } catch {
    return { error: 'No connection to the AI. Check your internet.' };
  }
}
