import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { openOwnBook } from '@/components/BookActions';
import { BookCover } from '@/components/BookCover';
import { CardHeading } from '@/components/CardHeading';
import { Icon } from '@/components/Icon';
import {
  downloadFamilyBook,
  familyBooks,
  familyMembers,
  inviteLink,
  joinFamily,
  myFamilies,
  nameFromEmail,
  pendingJoin,
  removeFamilyBook,
  type Family,
  type FamilyBook,
} from '@/lib/family';
import { haptic } from '@/lib/haptics';
import { ownSourceId } from '@/lib/ownbooks';
import { shareMessage } from '@/lib/share';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { Source } from '@/lib/types';

/**
 * The family library: books your family shared with each other. Opening an invite link joins the family (after
 * signing in); each book downloads onto this device in one tap and opens like your own, with its main ideas.
 */
export default function FamilyScreen() {
  const { account, ownBooks, addOwnBook, ready } = useStore();
  const [families, setFamilies] = useState<Family[] | null>(null);
  const [books, setBooks] = useState<FamilyBook[]>([]);
  const [members, setMembers] = useState<Record<string, { user_id: string; name: string | null }[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const myName = account ? nameFromEmail(account.email) : '';

  const load = useCallback(async () => {
    if (!account) return;
    setError(null);
    try {
      // Joining from an invite link first, so its books show straight away.
      const code = pendingJoin.get();
      if (code) {
        pendingJoin.set(null);
        const f = await joinFamily(code, myName);
        setNote(`You joined ${f.name}. Its books are below.`);
        haptic.success();
      }
      const fs = await myFamilies();
      setFamilies(fs);
      setBooks(await familyBooks());
      const m: typeof members = {};
      for (const f of fs) m[f.id] = await familyMembers(f.id);
      setMembers(m);
    } catch (e) {
      setError((e as Error).message);
      setFamilies((f) => f ?? []);
    }
  }, [account, myName]);

  useEffect(() => {
    // Loading data from the server once the account is known.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (ready && account) load();
  }, [ready, account, load]);

  const local = (b: FamilyBook) => ownBooks.find((o) => o.family?.bookId === b.id);
  const get = async (b: FamilyBook) => {
    const have = local(b);
    if (have) return openOwnBook(have);
    setBusy(b.id);
    setError(null);
    try {
      const own = await downloadFamilyBook(b);
      addOwnBook(own);
      haptic.success();
      setNote(`${b.title} is in your Library now.`);
      if (own.ideas?.length) router.push({ pathname: '/book/[id]', params: { id: ownSourceId(own.id) } });
      else openOwnBook(own);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };
  const invite = (f: Family) =>
    shareMessage(
      f.name,
      `Join ${f.name} on DeepStach: we share our books there, and you can read them for free. Open this link and sign in:`,
      inviteLink(f),
    ).then((r) => r === 'copied' && setNote('Invite link copied. Paste it in WhatsApp or Messages.'));
  const remove = async (b: FamilyBook) => {
    setBusy(b.id);
    try {
      await removeFamilyBook(b);
      setBooks((list) => list.filter((x) => x.id !== b.id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  if (!account) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Icon name="users" size={30} color={colors.accent} strokeWidth={1.8} />
          </View>
          <Text style={styles.heroTitle}>{pendingJoin.get() ? 'You’re invited to a family library' : 'Family library'}</Text>
          <Text style={styles.heroText}>Share the books you own with your family, and read theirs. Sign in or create a free account to continue.</Text>
          <Pressable accessibilityRole="button" onPress={() => router.push('/auth')} style={styles.primary}>
            <Text style={styles.primaryText}>Sign in or create an account</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => (setRefreshing(true), load().finally(() => setRefreshing(false)))} />}>
      {!!note && (
        <Pressable onPress={() => setNote(null)} style={styles.note}>
          <Icon name="checkCircle" size={18} color={colors.accent} strokeWidth={2} />
          <Text style={styles.noteText}>{note}</Text>
        </Pressable>
      )}
      {!!error && <Text style={styles.error}>{error}</Text>}
      {families === null ? (
        <ActivityIndicator color={colors.muted} style={{ marginTop: 40 }} />
      ) : families.length === 0 ? (
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Icon name="users" size={30} color={colors.accent} strokeWidth={1.8} />
          </View>
          <Text style={styles.heroTitle}>Share books with your family</Text>
          <Text style={styles.heroText}>
            Long-press one of your books in the Library and choose “Share with my family”. The app makes your family library and gives you an invite link to send on WhatsApp or Messages.
          </Text>
        </View>
      ) : (
        families.map((f) => {
          const list = books.filter((b) => b.family_id === f.id);
          const people = members[f.id] ?? [];
          return (
            <View key={f.id} style={styles.section}>
              <View style={styles.card}>
                <CardHeading icon="users" title={f.name} />
                <Text style={styles.muted}>
                  {people.length} {people.length === 1 ? 'member' : 'members'}
                  {people.length ? `: ${people.map((p) => (p.user_id === account.id ? 'you' : p.name || 'someone')).join(', ')}` : ''}
                </Text>
                <Pressable accessibilityRole="button" onPress={() => invite(f)} style={styles.primary}>
                  <Icon name="share" size={18} color={colors.onAccent} strokeWidth={2.2} />
                  <Text style={styles.primaryText}>Invite someone</Text>
                </Pressable>
              </View>
              {list.length === 0 ? (
                <Text style={styles.muted}>No books yet. Long-press one of your books in the Library and choose “Share with my family”.</Text>
              ) : (
                list.map((b) => {
                  const have = local(b);
                  const cover: Source = { id: `family-${b.id}`, title: b.title, author: b.author || 'PDF', kind: 'book', topicId: '', description: '' };
                  return (
                    <View key={b.id} style={styles.row}>
                      <BookCover book={cover} width={56} favoriteKey={null} onPress={() => get(b)} />
                      <View style={styles.rowText}>
                        <Text style={styles.rowTitle} numberOfLines={2}>
                          {b.title}
                        </Text>
                        <Text style={styles.muted} numberOfLines={1}>
                          {[b.author, b.kind.toUpperCase(), b.owner === account.id ? 'shared by you' : `from ${b.owner_name ?? 'family'}`].filter(Boolean).join(' · ')}
                        </Text>
                        {!!b.ideas?.length && <Text style={styles.ideas}>{b.ideas.length} main ideas</Text>}
                      </View>
                      <View style={styles.actions}>
                        <Pressable accessibilityRole="button" accessibilityLabel={have ? `Open ${b.title}` : `Get ${b.title}`} disabled={busy === b.id} onPress={() => get(b)} style={[styles.get, have && styles.open]}>
                          {busy === b.id ? <ActivityIndicator color={have ? colors.text : colors.onAccent} /> : <Text style={[styles.getText, have && styles.openText]}>{have ? 'Open' : 'Get'}</Text>}
                        </Pressable>
                        {b.owner === account.id && (
                          <Pressable accessibilityLabel={`Stop sharing ${b.title}`} onPress={() => remove(b)} hitSlop={6}>
                            <Text style={styles.stop}>Stop sharing</Text>
                          </Pressable>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          );
        })
      )}
      <Text style={styles.footer}>Only people who joined your family with an invite link can see these books. Each book is stored privately, up to 50 MB.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  hero: { alignItems: 'center', gap: 12, padding: 24, borderRadius: 22, backgroundColor: colors.surface, marginTop: 8 },
  heroIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  heroTitle: { color: colors.text, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  heroText: { color: colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  section: { gap: 10 },
  card: { gap: 10, padding: 16, borderRadius: 18, backgroundColor: colors.surface },
  muted: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  primary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: 'stretch', paddingVertical: 13, borderRadius: 999, backgroundColor: colors.accent },
  primaryText: { color: colors.onAccent, fontWeight: '800', fontSize: 15 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16, backgroundColor: colors.surface },
  rowText: { flex: 1, gap: 3 },
  rowTitle: { color: colors.text, fontWeight: '700', fontSize: 16 },
  ideas: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  actions: { alignItems: 'center', gap: 8 },
  get: { minWidth: 72, alignItems: 'center', paddingVertical: 9, paddingHorizontal: 16, borderRadius: 999, backgroundColor: colors.accent },
  open: { backgroundColor: colors.surfaceRaised },
  getText: { color: colors.onAccent, fontWeight: '800' },
  openText: { color: colors.text },
  stop: { color: colors.danger, fontSize: 12, fontWeight: '700' },
  note: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 14, backgroundColor: colors.surface },
  noteText: { flex: 1, color: colors.text, fontWeight: '600' },
  error: { color: colors.danger, fontWeight: '600' },
  footer: { color: colors.muted, fontSize: 12, textAlign: 'center', lineHeight: 17 },
});
