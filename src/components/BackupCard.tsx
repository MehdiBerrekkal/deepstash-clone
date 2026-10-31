import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { makeBackup, pickBackup, restoreBooks, shareBackup, type Backup } from '@/lib/backup';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

const daysSince = (iso?: string) => (iso ? Math.floor((Date.now() - new Date(iso).getTime()) / 86400e3) : null);

/** You → Backup & restore: save everything to a file, and load it back (merged or replacing this device's data). */
export function BackupCard() {
  const { exportUser, importUser, markBackedUp, lastBackup, ownBooks } = useStore();
  const [busy, setBusy] = useState<'export' | 'import' | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [incoming, setIncoming] = useState<Backup | null>(null);
  const age = daysSince(lastBackup);
  const due = age === null || age >= 7;

  const doExport = async () => {
    setBusy('export');
    setMessage(null);
    try {
      await shareBackup(await makeBackup(exportUser()));
      markBackedUp();
      setMessage('Backup saved. Keep the file somewhere safe, like iCloud Drive.');
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setMessage(`The backup couldn't be made: ${(e as Error).message}`);
    } finally {
      setBusy(null);
    }
  };
  const doPick = async () => {
    setBusy('import');
    setMessage(null);
    try {
      const b = await pickBackup();
      if (b) setIncoming(b);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(null);
    }
  };
  const doRestore = async (mode: 'merge' | 'replace') => {
    if (!incoming) return;
    setBusy('import');
    try {
      await restoreBooks(incoming);
      importUser(incoming.user, mode);
      setMessage(`Restored from the backup of ${new Date(incoming.exportedAt).toLocaleDateString()}${mode === 'merge' ? ', merged with what was here' : ''}.`);
      setIncoming(null);
    } catch (e) {
      setMessage(`Restore failed: ${(e as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.heading}>💾 Backup & restore</Text>
        <Text style={[styles.age, due && styles.due]}>{age === null ? 'never backed up' : age === 0 ? 'backed up today' : `${age} ${age === 1 ? 'day' : 'days'} ago`}</Text>
      </View>
      <Text style={styles.muted}>
        Your progress, highlights, notes, stashes, Brain scores, settings and {ownBooks.length ? `your ${ownBooks.length} saved ${ownBooks.length === 1 ? 'book' : 'books'}` : 'saved books'} live only in this browser. Save them to a file
        {due ? ' — it’s been a while.' : '.'}
      </Text>
      {incoming ? (
        <View style={styles.gap}>
          <Text style={styles.text}>
            Backup from {new Date(incoming.exportedAt).toLocaleString()}: {Object.keys(incoming.books ?? {}).length} books, {((incoming.user.highlights as unknown[]) ?? []).length} highlights.
          </Text>
          <Pressable accessibilityLabel="Merge backup" onPress={() => doRestore('merge')} style={[styles.button, styles.primary]}>
            <Text style={styles.primaryText}>Merge with this device</Text>
          </Pressable>
          <Pressable accessibilityLabel="Replace with backup" onPress={() => doRestore('replace')} style={styles.button}>
            <Text style={styles.buttonText}>Replace everything here</Text>
          </Pressable>
          <Pressable onPress={() => setIncoming(null)} style={styles.link}>
            <Text style={styles.muted}>Cancel</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.row}>
          <Pressable accessibilityLabel="Export backup" disabled={!!busy} onPress={doExport} style={[styles.button, styles.primary, styles.flex]}>
            {busy === 'export' ? <ActivityIndicator color={colors.onAccent} /> : <Text style={styles.primaryText}>Save backup</Text>}
          </Pressable>
          <Pressable accessibilityLabel="Restore backup" disabled={!!busy} onPress={doPick} style={[styles.button, styles.flex]}>
            {busy === 'import' ? <ActivityIndicator color={colors.text} /> : <Text style={styles.buttonText}>Restore…</Text>}
          </Pressable>
        </View>
      )}
      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 20, backgroundColor: colors.surface, gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '800' },
  age: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  due: { color: '#C2452D' },
  muted: { color: colors.muted, lineHeight: 20 },
  text: { color: colors.text, lineHeight: 20 },
  gap: { gap: 8 },
  row: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
  button: { minHeight: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, backgroundColor: colors.surfaceRaised },
  primary: { backgroundColor: colors.accent },
  primaryText: { color: colors.onAccent, fontWeight: '800' },
  buttonText: { color: colors.text, fontWeight: '800' },
  link: { alignItems: 'center', padding: 8 },
  message: { color: colors.text, fontSize: 13, lineHeight: 19 },
});
