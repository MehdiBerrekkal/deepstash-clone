import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';

/**
 * Accounts (Supabase Auth): email + password, password reset by email, and each account's settings and progress
 * saved online in `user_state` (one private row per user, see supabase/accounts.sql). Without Supabase keys in the
 * build, accounts are switched off and the app keeps working as a single guest on the device.
 */
export type Account = { id: string; email: string };

export const accountsEnabled = !!supabase;

/** Where reset links send people back to: the app's own "set a new password" page. */
export function resetRedirect() {
  if (Platform.OS !== 'web' || typeof location === 'undefined') return undefined;
  // On GitHub Pages the app lives under /deepstash-clone/; keep that prefix.
  const base = location.pathname.startsWith('/deepstash-clone') ? '/deepstash-clone' : '';
  return `${location.origin}${base}/reset-password`;
}

/** Plain-language versions of the usual auth errors. */
export function friendlyError(e: unknown): string {
  const m = (e as { message?: string })?.message ?? String(e);
  if (/invalid login credentials/i.test(m)) return 'Wrong email or password.';
  if (/email not confirmed/i.test(m)) return 'Please confirm your email first: open the link we sent you.';
  if (/already registered|already been registered/i.test(m)) return 'An account with this email already exists. Log in instead.';
  if (/password should be at least/i.test(m)) return 'The password needs at least 8 characters.';
  if (/rate limit|too many/i.test(m)) return 'Too many tries. Wait a minute and try again.';
  if (/network|fetch/i.test(m)) return 'No connection. Check your internet and try again.';
  return m;
}

const need = () => {
  if (!supabase) throw new Error('Accounts are not set up yet.');
  return supabase;
};

export async function signIn(email: string, password: string) {
  const { error } = await need().auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
}

/** Returns true when the account is ready, false when the email must be confirmed first. */
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await need().auth.signUp({
    email: email.trim(),
    password,
    options: { data: { name: name.trim() }, emailRedirectTo: resetRedirect()?.replace('/reset-password', '/') },
  });
  if (error) throw error;
  return !!data.session;
}

export async function sendReset(email: string) {
  const { error } = await need().auth.resetPasswordForEmail(email.trim(), { redirectTo: resetRedirect() });
  if (error) throw error;
}

export async function setNewPassword(password: string) {
  const { error } = await need().auth.updateUser({ password });
  if (error) throw error;
}

export async function signOut() {
  await supabase?.auth.signOut();
}

/** The account's saved data, or null if there is none yet. */
export async function loadCloud(userId: string): Promise<{ data: Record<string, unknown>; updatedAt: string } | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('user_state').select('data, updated_at').eq('user_id', userId).maybeSingle();
  if (error || !data) return null;
  return { data: data.data as Record<string, unknown>, updatedAt: data.updated_at as string };
}

export async function saveCloud(userId: string, state: Record<string, unknown>) {
  if (!supabase) return;
  await supabase.from('user_state').upsert({ user_id: userId, data: state, updated_at: new Date().toISOString() });
}
