import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { BookCover } from '@/components/BookCover';
import { classicAsSource } from '@/lib/classicSource';
import { classicReaderId, type Classic } from '@/lib/fullbook';
import { haptic } from '@/lib/haptics';
import { deleteOwnBookFiles, ownSourceId, type OwnBook } from '@/lib/ownbooks';
import { shareClassic, shareOwn } from '@/lib/shareBook';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { Source } from '@/lib/types';

export type BookActionTarget = { kind: 'own'; book: OwnBook } | { kind: 'classic'; book: Classic };

/** Opens one of your own books in the right reader. */
export function openOwnBook(book: OwnBook) {
  if (book.kind === 'epub') return router.push({ pathname: '/reader/[id]', params: { id: book.id, kind: 'own' } });
  router.push({ pathname: '/pdfbook/[id]', params: { id: book.id, source: 'own' } });
}

/**
 * What a long press on a book cover opens, like an iPhone's context menu: the screen blurs, the book lifts out
 * and grows a little, and a compact menu appears under it. Every book: open, favourite, share. Books you
 * imported also get their main ideas, rename and delete; the app's own books can't be deleted.
 */
export function BookActions({ target, onClose }: { target: BookActionTarget; onClose: () => void }) {
  const { isFavoriteBook, toggleFavoriteBook, removeOwnBook, renameOwnBook, topics } = useStore();
  const [mode, setMode] = useState<'menu' | 'rename' | 'delete'>('menu');
  const [name, setName] = useState(target.book.title);

  // A short buzz as the menu opens.
  useEffect(() => {
    haptic.press();
  }, []);

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
  const cover: Source = own
    ? { id: ownSourceId(own.id), title: own.title, author: own.author === 'PDF' ? 'Your PDF' : own.author, kind: 'book', topicId: own.topicId ?? topics[0]?.id ?? '', description: '' }
    : classicAsSource(target.book as Classic);
  const sub = own ? (own.kind === 'pdf' ? 'Your PDF' : `Your book · ${own.author}`) : target.book.author;

  return (
    <Modal visible transparent animationType="none" onRequestClose={close}>
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(160)} style={[StyleSheet.absoluteFill, styles.backdrop]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Close" />
      </Animated.View>
      <ScrollView contentContainerStyle={styles.center} keyboardShouldPersistTaps="handled" pointerEvents="box-none">
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessible={false} />
        <Animated.View entering={ZoomIn.springify().damping(15).stiffness(210)} exiting={ZoomOut.duration(140)} style={styles.lift}>
          <BookCover book={cover} width={128} favoriteKey={null} onPress={own ? then(() => openOwnBook(own)) : then(() => router.push({ pathname: '/classic/[id]', params: { id: target.book.id } }))} />
        </Animated.View>
        <Animated.View entering={FadeIn.delay(80).duration(200)} style={styles.heading}>
          <Text style={styles.title} numberOfLines={2}>
            {target.book.title}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {sub}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).springify().damping(17).stiffness(200)} exiting={FadeOut.duration(120)} style={styles.menu}>
          {mode === 'rename' && own ? (
            <View style={styles.block}>
              <Text style={styles.blockTitle}>Rename</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                autoFocus
                selectTextOnFocus
                style={styles.input}
                placeholder="Book title"
                placeholderTextColor={colors.muted}
                onSubmitEditing={() => (renameOwnBook(own.id, name), close())}
              />
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
              <Text style={styles.blockTitle}>Delete this book?</Text>
              <Text style={styles.warn}>It leaves this device with its main-idea cards, reading progress and bookmarks. Your highlights stay.</Text>
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
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              <Group>
                {own ? (
                  <>
                    <Row icon="book" label="Read the book" onPress={then(() => openOwnBook(own))} />
                    {!!own.ideas?.length && (
                      <Row icon="bulb" label="Main ideas" detail={String(own.ideas.length)} onPress={then(() => router.push({ pathname: '/book/[id]', params: { id: ownSourceId(own.id) } }))} />
                    )}
                  </>
                ) : (
                  <Row icon="book" label="Open" onPress={then(() => router.push({ pathname: '/classic/[id]', params: { id: target.book.id } }))} />
                )}
              </Group>
              <Group>
                <Row icon={fav ? 'heartFull' : 'heart'} label={fav ? 'Remove from favorites' : 'Add to favorites'} onPress={then(() => toggleFavoriteBook(favKey))} />
                <Row icon="share" label="Share" onPress={then(() => void (own ? shareOwn(own) : shareClassic(target.book as Classic)))} />
              </Group>
              {own && (
                <Group last>
                  <Row icon="pencil" label="Rename" onPress={() => setMode('rename')} />
                  <Row icon="trash" label="Delete from this device" danger onPress={() => setMode('delete')} />
                </Group>
              )}
            </>
          )}
        </Animated.View>
      </ScrollView>
    </Modal>
  );
}

function Group({ children, last }: { children: ReactNode; last?: boolean }) {
  return <View style={[styles.group, last && styles.groupLast]}>{children}</View>;
}

type IconName = 'book' | 'bulb' | 'heart' | 'heartFull' | 'share' | 'pencil' | 'trash';

function Row({ icon, label, detail, onPress, danger }: { icon: IconName; label: string; detail?: string; onPress: () => void; danger?: boolean }) {
  const tint = danger ? colors.danger : colors.text;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
        {label}
      </Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      <MenuIcon name={icon} color={tint} />
    </Pressable>
  );
}

const ICONS: Record<IconName, string> = {
  book: 'M4 5.5C4 4.7 4.7 4 5.5 4H10c1.1 0 2 .9 2 2v13c0-.8-.7-1.5-1.5-1.5H4zM20 5.5c0-.8-.7-1.5-1.5-1.5H14c-1.1 0-2 .9-2 2v13c0-.8.7-1.5 1.5-1.5H20z',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0012 3z',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z',
  heartFull: 'M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z',
  share: 'M12 15V3M7.5 7.5L12 3l4.5 4.5M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
  pencil: 'M4 20l4-1 10.5-10.5a2.1 2.1 0 00-3-3L5 16l-1 4zM14 7l3 3',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3',
};

function MenuIcon({ name, color }: { name: IconName; color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill={name === 'heartFull' ? color : 'none'} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d={ICONS[name]} />
    </Svg>
  );
}

const blur = Platform.OS === 'web' ? ({ backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)' } as object) : {};

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(8,9,12,0.55)', ...blur },
  center: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 },
  lift: { shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 24, shadowOffset: { width: 0, height: 14 }, borderRadius: 10 },
  heading: { alignItems: 'center', maxWidth: 300, gap: 2 },
  title: { color: '#F4F1EA', fontSize: 17, fontWeight: '800', textAlign: 'center' },
  sub: { color: 'rgba(244,241,234,0.7)', fontSize: 13 },
  menu: { width: 270, borderRadius: 16, backgroundColor: colors.surface, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  group: { borderBottomWidth: 7, borderBottomColor: colors.background },
  groupLast: { borderBottomWidth: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, paddingHorizontal: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  rowPressed: { backgroundColor: colors.surfaceRaised },
  label: { flex: 1, fontSize: 16, fontWeight: '500' },
  detail: { color: colors.muted, fontSize: 15 },
  block: { gap: 12, padding: 16 },
  blockTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  input: { backgroundColor: colors.surfaceRaised, color: colors.text, fontSize: 16, padding: 12, borderRadius: 10 },
  warn: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  buttons: { flexDirection: 'row', gap: 8 },
  primary: { flex: 1, paddingVertical: 12, borderRadius: 999, alignItems: 'center', backgroundColor: colors.accent },
  deleteButton: { backgroundColor: colors.danger },
  primaryText: { color: colors.onAccent, fontWeight: '800' },
  deleteText: { color: '#fff', fontWeight: '800' },
  secondary: { flex: 1, paddingVertical: 12, borderRadius: 999, alignItems: 'center', backgroundColor: colors.surfaceRaised },
  secondaryText: { color: colors.text, fontWeight: '700' },
});
