import type { OwnBook } from '@/lib/ownbooks';
import { exportOwnFile, importOwnFile } from '@/lib/ownbooks';
import { APP_URL } from '@/lib/share';
import { supabase } from '@/lib/supabase';

/**
 * The family library: you share your own books with your family only. A family has an invite link; people who join
 * with it (signed in) see the family's books and can download them. Files live in a private storage bucket that only
 * members can read (see supabase/family.sql).
 */
export type Family = { id: string; name: string; owner: string; invite_code: string };
export type FamilyBook = {
  id: string;
  family_id: string;
  owner: string;
  owner_name: string | null;
  kind: 'epub' | 'pdf';
  title: string;
  author: string;
  lang: string | null;
  description: string | null;
  ideas: { title: string; body: string }[] | null;
  ideas_by: 'ai' | 'picked' | null;
  path: string;
  size: number | null;
  created_at: string;
};

const BUCKET = 'family-books';
const PENDING = 'deepstash-clone/pending-family-join';

function db() {
  if (!supabase) throw new Error('Accounts are not set up yet.');
  return supabase;
}

/** Turns database errors into something a person can act on. */
function friendly(e: { message?: string; code?: string } | null): Error {
  const m = e?.message ?? 'Something went wrong.';
  if (/relation .* does not exist|schema cache|Bucket not found/i.test(m)) return new Error('The family library isn’t switched on yet (its database part is missing).');
  if (/exceeded the maximum allowed size|Payload too large|413/i.test(m)) return new Error('This file is too big to share (the limit is 50 MB).');
  return new Error(m);
}

export const inviteLink = (f: Family) => `${APP_URL}/family?join=${f.invite_code}`;

export async function myFamilies(): Promise<Family[]> {
  const { data, error } = await db().from('families').select('id, name, owner, invite_code').order('created_at');
  if (error) throw friendly(error);
  return (data ?? []) as Family[];
}

/** Your family, made the first time you share (named after you). */
export async function ensureFamily(userId: string, myName: string): Promise<Family> {
  const existing = await myFamilies();
  if (existing.length) return existing.find((f) => f.owner === userId) ?? existing[0];
  const { data, error } = await db().from('families').insert({ name: `${myName}’s family` }).select('id, name, owner, invite_code').single();
  if (error) throw friendly(error);
  const { error: e2 } = await db().from('family_members').insert({ family_id: data.id, name: myName });
  if (e2) throw friendly(e2);
  return data as Family;
}

export async function joinFamily(code: string, myName: string): Promise<{ id: string; name: string }> {
  const { data, error } = await db().rpc('join_family', { code, member_name: myName });
  if (error) throw friendly(error);
  const row = (Array.isArray(data) ? data[0] : data) as { id: string; name: string };
  return row;
}

export async function familyMembers(familyId: string): Promise<{ user_id: string; name: string | null }[]> {
  const { data, error } = await db().from('family_members').select('user_id, name').eq('family_id', familyId).order('joined_at');
  if (error) throw friendly(error);
  return data ?? [];
}

export async function familyBooks(): Promise<FamilyBook[]> {
  const { data, error } = await db().from('family_books').select('*').order('created_at', { ascending: false });
  if (error) throw friendly(error);
  return (data ?? []) as FamilyBook[];
}

/** Uploads one of your books to the family library (once per family). */
export async function shareWithFamily(book: OwnBook, family: Family, myName: string): Promise<FamilyBook> {
  const { data: already } = await db().from('family_books').select('*').eq('family_id', family.id).eq('title', book.title).eq('kind', book.kind).limit(1);
  if (already?.[0]) return already[0] as FamilyBook;
  const file = await exportOwnFile(book);
  const path = `${family.id}/${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}.${file.ext}`;
  const up = await db().storage.from(BUCKET).upload(path, file.data, { contentType: file.contentType, upsert: false });
  if (up.error) throw friendly(up.error);
  const size = file.data instanceof Blob ? file.data.size : file.data.byteLength;
  const { data, error } = await db()
    .from('family_books')
    .insert({
      family_id: family.id,
      owner_name: myName,
      kind: book.kind,
      title: book.title,
      author: book.author === 'PDF' ? '' : book.author,
      lang: book.lang ?? null,
      description: book.description ?? null,
      ideas: book.ideas?.length ? book.ideas : null,
      ideas_by: book.ideasBy ?? null,
      path,
      size,
    })
    .select('*')
    .single();
  if (error) {
    await db().storage.from(BUCKET).remove([path]);
    throw friendly(error);
  }
  return data as FamilyBook;
}

/** Downloads a family book onto this device, as one of your own books (with its main ideas). */
export async function downloadFamilyBook(b: FamilyBook): Promise<OwnBook> {
  const { data, error } = await db().storage.from(BUCKET).download(b.path);
  if (error || !data) throw friendly(error);
  return importOwnFile(
    {
      kind: b.kind,
      title: b.title,
      author: b.author || (b.kind === 'pdf' ? 'PDF' : ''),
      lang: b.lang ?? undefined,
      description: b.description ?? undefined,
      ideas: b.ideas ?? undefined,
      ideasBy: b.ideas_by ?? undefined,
      family: { bookId: b.id, from: b.owner_name ?? undefined },
    },
    data,
  );
}

export async function removeFamilyBook(b: FamilyBook) {
  await db().storage.from(BUCKET).remove([b.path]);
  const { error } = await db().from('family_books').delete().eq('id', b.id);
  if (error) throw friendly(error);
}

/** An invite opened before signing in waits here until the person has an account. */
export const pendingJoin = {
  get: () => {
    try {
      return globalThis.localStorage?.getItem(PENDING) ?? null;
    } catch {
      return null;
    }
  },
  set: (code: string | null) => {
    try {
      if (code) globalThis.localStorage?.setItem(PENDING, code);
      else globalThis.localStorage?.removeItem(PENDING);
    } catch {
      // private mode: the person opens the link again after signing in
    }
  },
};

export const nameFromEmail = (email: string) => {
  const n = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  return n ? n[0].toUpperCase() + n.slice(1) : 'Me';
};
