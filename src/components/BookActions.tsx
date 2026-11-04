import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';

import { classicReaderId, type Classic } from '@/lib/fullbook';
import { deleteOwnBookFiles, ownSourceId, type OwnBook } from '@/lib/ownbooks';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import { forgetAiTry, useRewriteWithAi } from '@/lib/useOwnIdeas';

export type BookActionTarget = { kind: 'own'; book: OwnBook } | { kind: 'classic'; book: Classic };

/** Opens one of your own books in the right reader. */
export function openOwnBook(book: OwnBook, ai?: boolean) {
  if (book.kind === 'epub') return router.push({ pathname: '/reader/[id]', params: { id: book.id, kind: 'own' } });
  router.push({ pathname: '/pdfbook/[id]', params: { id: book.id, source: 'own', ...(ai ? { ai: '1' } : {}) } });
}

/**
 * The menu a long press on a book cover opens. Every book: open, favourite, share. Books you imported also get
 * their main ideas, "Rewrite ideas with AI", rename and delete; the app's own books can't be deleted.
 */
export function BookActions({ target, onClose }: { target: BookActionTarget; onClose: () => void }) {
  const { isFavoriteBook, toggleFavoriteBook, removeOwnBook, renameOwnBook, account } = useStore();
  const rewrite = useRewriteWithAi();
  const [mode, setMode] = useState<'menu' | 'rename' | 'delete'>('menu');
  const [name, setName] = useState(target.book.title);
  const [aiState, setAiState] = useState<{ busy?: boolean; message?: string }>({});

  const own = target.kind === 'own' ? target.book : null;
  const favKey = own ? `own:${own.id}` : classicReaderId(target.book.id);
  const fav = isFavoriteBook(favKey);
  const close = () => {
    setMode('menu');
    onClose();
  };
  const then = (fn: () => void) => () => {
    close();
    fn();
  };

  const runAi = async () => {
    if (!own) return;
    if (own.kind === 'pdf') {
      // A PDF's text comes from the PDF engine, so the rewrite happens in the PDF reader.
      forgetAiTry(own.id);
      close();
      openOwnBook(own, true);
      return;
    }
    setAiState({ busy: true });
    const err = await rewrite(own);
    setAiState({ message: err ? `AI couldn’t write the cards: ${err}` : '✨ Done: the cards are now AI summaries.' });
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title} numberOfLines={2}>
            {target.book.title}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {own ? (own.kind === 'pdf' ? `Your PDF · ${own.fileName}` : `Your book · ${own.author}`) : target.book.author}
          </Text>

          {mode === 'rename' && own ? (
            <View style={styles.block}>
              <TextInput value={name} onChangeText={setName} autoFocus style={styles.input} placeholder="Book title" placeholderTextColor={colors.muted} onSubmitEditing={() => (renameOwnBook(own.id, name), close())} />
              <View style={styles.buttons}>
                <Pressable onPress={() => setMode('menu')} style={styles.secondary}>
                  <Text style={styles.secondaryText}>Cancel</Text>
                </Pressable>
                <Pressable onPress={() => (renameOwnBook(own.id, name), close())} style={styles.primary}>
                  <Text style={styles.primaryText}>Save</Text>
                </Pressable>
              </View>
            </View>
          ) : mode === 'delete' && own ? (
            <View style={styles.block}>
              <Text style={styles.warn}>Delete this book from this device? Its main-idea cards leave your stashes, and its reading progress and bookmarks are removed. Your highlights stay.</Text>
              <View style={styles.buttons}>
                <Pressable onPress={() => setMode('menu')} style={styles.secondary}>
                  <Text style={styles.secondaryText}>Cancel</Text>
                </Pressable>
                <Pressable
                  accessibilityLabel={`Delete ${own.title}`}
                  onPress={then(() => {
                    removeOwnBook(own.id);
                    deleteOwnBookFiles(own).catch(() => {});
                  })}
                  style={[styles.primary, styles.deleteButton]}>
                  <Text style={styles.primaryText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View>
              {own ? (
                <>
                  <Row icon="📖" label="Read the book" onPress={then(() => openOwnBook(own))} />
                  {!!own.ideas?.length && (
                    <Row icon="💡" label={`Main ideas (${own.ideas.length})`} onPress={then(() => router.push({ pathname: '/book/[id]', params: { id: ownSourceId(own.id) } }))} />
                  )}
                  {account && (
                    <Pressable accessibilityRole="button" disabled={aiState.busy} onPress={runAi} style={styles.row}>
                      <Text style={styles.icon}>✨</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.label}>{own.ideasBy === 'ai' ? 'Rewrite ideas with AI again' : 'Write the ideas with AI'}</Text>
                        {aiState.busy ? <Text style={styles.note}>Asking Gemini… (10–20 seconds)</Text> : aiState.message ? <Text style={styles.note}>{aiState.message}</Text> : null}
                      </View>
                      {aiState.busy && <ActivityIndicator color={colors.accent} />}
                    </Pressable>
                  )}
                </>
              ) : (
                <Row icon="📖" label="Open" onPress={then(() => router.push({ pathname: '/classic/[id]', params: { id: target.book.id } }))} />
              )}
              <Row icon={fav ? '♥' : '♡'} label={fav ? 'Remove from favorites' : 'Add to favorites'} onPress={then(() => toggleFavoriteBook(favKey))} />
              <Row icon="↗" label="Share" onPress={then(() => Share.share({ message: `${target.book.title} by ${target.book.author}` }))} />
              {own && (
                <>
                  <Row icon="✏️" label="Rename" onPress={() => setMode('rename')} />
                  <Row icon="🗑" label="Delete from this device" danger onPress={() => setMode('delete')} />
                </>
              )}
              <Pressable onPress={close} style={styles.cancel}>
                <Text style={styles.secondaryText}>Close</Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Row({ icon, label, onPress, danger }: { icon: string; label: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.row}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.label, danger && styles.danger]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 18, paddingBottom: 34, gap: 4, width: '100%', maxWidth: 560, alignSelf: 'center' },
  title: { color: colors.text, fontSize: 19, fontWeight: '800' },
  sub: { color: colors.muted, fontSize: 13, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  icon: { fontSize: 18, width: 26, textAlign: 'center', color: colors.text },
  label: { color: colors.text, fontSize: 16, fontWeight: '600' },
  note: { color: colors.muted, fontSize: 13, marginTop: 3 },
  danger: { color: colors.danger },
  block: { gap: 14, marginTop: 6 },
  input: { backgroundColor: colors.surfaceRaised, color: colors.text, fontSize: 16, padding: 14, borderRadius: 12 },
  warn: { color: colors.text, fontSize: 15, lineHeight: 21 },
  buttons: { flexDirection: 'row', gap: 10 },
  primary: { flex: 1, paddingVertical: 14, borderRadius: 999, alignItems: 'center', backgroundColor: colors.accent },
  deleteButton: { backgroundColor: colors.danger },
  primaryText: { color: colors.onAccent, fontWeight: '800' },
  secondary: { flex: 1, paddingVertical: 14, borderRadius: 999, alignItems: 'center', backgroundColor: colors.surfaceRaised },
  secondaryText: { color: colors.text, fontWeight: '700' },
  cancel: { paddingVertical: 14, alignItems: 'center', marginTop: 6 },
});
