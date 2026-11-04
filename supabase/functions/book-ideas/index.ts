// Writes main-idea cards for a book a signed-in user opened from their own device, with Google's Gemini
// (free plan). The app sends the passages it picked from each part of the book; Gemini writes one card per
// part in its own words. The Gemini key stays here as a secret (GEMINI_API_KEY) and never reaches the app.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
/** Tried first; Google retires model names, so the newest Flash model on the account is looked up too. */
const PREFERRED = ['gemini-flash-latest', 'gemini-3.8-flash'];
let discovered: string[] | null = null;

/** The account's Flash models that can write text, newest version first (cached while the function stays warm). */
async function flashModels(key: string): Promise<string[]> {
  if (discovered) return discovered;
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200', { headers: { 'x-goog-api-key': key } });
    const data = await res.json();
    const names: string[] = (data?.models ?? [])
      .filter((m: { name: string; supportedGenerationMethods?: string[] }) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m: { name: string }) => m.name.replace(/^models\//, ''))
      .filter((n: string) => /^gemini-[\d.]+-flash(-lite)?$/.test(n));
    const version = (n: string) => parseFloat(n.match(/gemini-([\d.]+)/)?.[1] ?? '0');
    // Newest first, full Flash before Flash-Lite.
    discovered = names.sort((a, b) => version(b) - version(a) || Number(a.includes('lite')) - Number(b.includes('lite')));
  } catch {
    discovered = [];
  }
  return discovered;
}
const MAX_PARTS = 12;
const MAX_PART_CHARS = 5000;

type Part = { title?: string; text: string };
type Body = { title: string; author?: string; lang?: 'en' | 'fr'; kid?: boolean; parts: Part[] };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

function prompt(b: Body): string {
  const fr = b.lang === 'fr';
  const parts = b.parts
    .slice(0, MAX_PARTS)
    .map((p, i) => `### Part ${i + 1}${p.title ? ` — ${p.title}` : ''}\n${p.text.slice(0, MAX_PART_CHARS)}`)
    .join('\n\n');
  return [
    `You write "main idea" cards for a reading app, like Deepstash or Blinkist. The book is "${b.title}"${b.author ? ` by ${b.author}` : ''}.`,
    `Below are passages from each part of the book. For EACH part, write exactly one card about that part's main idea.`,
    `Rules:`,
    `- Write ${fr ? 'in French' : 'in English'}, entirely in your own words. Never copy sentences from the passages; a short quote of at most 10 words is fine.`,
    `- title: 2 to 7 words, a clear statement or name of the idea (no "Chapter", no numbering).`,
    `- body: 60 to 120 words. Explain the idea plainly, give one concrete example, and end with a short practical takeaway starting with "${fr ? "Aujourd'hui :" : 'Today:'}".`,
    b.kid ? `- The reader is a child aged 6 to 12: use short sentences and simple words.` : `- The reader is an adult: be clear and direct, no filler.`,
    `- If a part is a story rather than an argument, describe its lesson or theme without spoiling the ending.`,
    `Return JSON: {"ideas":[{"title":"...","body":"..."}]} with one entry per part, in order.`,
    ``,
    parts,
  ].join('\n');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) return json({ error: 'not_configured' }, 503);

  // Only signed-in accounts, so the free quota can't be used by strangers.
  const auth = req.headers.get('Authorization') ?? '';
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: auth } },
  });
  const { data: user } = await supabase.auth.getUser(auth.replace(/^Bearer\s+/i, ''));
  if (!user?.user) return json({ error: 'sign_in' }, 401);

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }
  if (!body?.title || !Array.isArray(body.parts) || body.parts.length === 0) return json({ error: 'bad_request' }, 400);
  const count = Math.min(body.parts.length, MAX_PARTS);

  const errors: string[] = [];
  const models = [...new Set([...PREFERRED, ...(await flashModels(key))])].slice(0, 4);
  for (const model of models) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt(body) }] }],
        generationConfig: {
          temperature: 0.6,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              ideas: {
                type: 'ARRAY',
                items: { type: 'OBJECT', properties: { title: { type: 'STRING' }, body: { type: 'STRING' } }, required: ['title', 'body'] },
              },
            },
            required: ['ideas'],
          },
        },
      }),
    });
    if (!res.ok) {
      errors.push(`${model}: ${res.status} ${(await res.text()).slice(0, 300)}`);
      // Out of free quota on this model: another model has its own quota, so keep going.
      continue;
    }
    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '';
    try {
      const ideas = (JSON.parse(text).ideas as { title: string; body: string }[])
        .filter((i) => i?.title && i?.body)
        .slice(0, count)
        .map((i) => ({ title: String(i.title).trim().slice(0, 90), body: String(i.body).trim().slice(0, 1200) }));
      if (ideas.length) return json({ ideas, model });
      errors.push(`${model}: empty`);
    } catch {
      errors.push(`${model}: unreadable answer`);
    }
  }
  console.error(errors.join(' | '));
  if (errors.length && errors.every((e) => / 429 /.test(e))) return json({ error: 'busy' }, 429);
  return json({ error: 'failed' }, 502);
});
