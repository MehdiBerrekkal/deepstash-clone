import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { DefineCard } from '@/components/DefineCard';
import { QuoteImage } from '@/components/QuoteImage';
import { HIGHLIGHT_COLORS, displayFont } from '@/lib/bookType';
import type { FullBook } from '@/lib/fullbook';
import { splitSentences } from '@/lib/listen';
import { copyText } from '@/lib/share';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import type { Highlight, HighlightColor } from '@/lib/types';

type Props = {
  /** The paragraph that was long-pressed. */
  at: { chapter: number; para: number };
  book: FullBook;
  readerId: string;
  topicId: string;
  /** Book language, for the dictionary. */
  language: string;
  onClose: () => void;
};

/**
 * Long-press a paragraph: pick the sentences you want (tap one, then tap another to extend), then highlight them in one
 * of four colours, add a note, copy, share as an image or save to a stash. Tapping an existing highlight edits it.
 */
export function HighlightSheet({ at, book, readerId, topicId, language, onClose }: Props) {
  const { highlights, addHighlight, updateHighlight, removeHighlight, stashes, saveClip, toggleInStash } = useStore();
  const text = book.chapters[at.chapter]?.paragraphs[at.para] ?? '';
  const chapterTitle = book.chapters[at.chapter]?.title ?? '';
  const sentences = useMemo(() => splitSentences(text), [text]);
  const here = highlights.filter((h) => h.readerId === readerId && h.chapter === at.chapter && h.para === at.para);

  const rangeOf = (h: Highlight): [number, number] => {
    const a = sentences.findIndex((s) => s.to > h.char);
    const b = sentences.findLastIndex((s) => s.from < h.to);
    return [Math.max(0, a), Math.max(0, b)];
  };
  const [editing, setEditing] = useState<string | null>(here[0]?.id ?? null);
  const [range, setRange] = useState<[number, number]>(() => (here[0] ? rangeOf(here[0]) : [0, sentences.length - 1]));
  const [anchor, setAnchor] = useState<number | null>(null);
  const current = here.find((h) => h.id === editing) ?? null;
  const [note, setNote] = useState(current?.note ?? '');
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState(false);
  const [savedTo, setSavedTo] = useState<string[]>([]);
  const [mode, setMode] = useState<'select' | 'define'>('select');
  const [word, setWord] = useState<string | null>(null);

  const from = sentences[range[0]]?.from ?? 0;
  const to = sentences[range[1]]?.to ?? text.length;
  const selected = text.slice(from, to).trim();
  const end = from + text.slice(from, to).trimEnd().length;

  const tapSentence = (i: number) => {
    const hit = here.find((h) => h.char < sentences[i].to && h.to > sentences[i].from);
    if (anchor === null && hit && hit.id !== editing) {
      setEditing(hit.id);
      setRange(rangeOf(hit));
      setNote(hit.note ?? '');
      return;
    }
    if (anchor === null) {
      setRange([i, i]);
      setAnchor(i);
    } else {
      setRange([Math.min(anchor, i), Math.max(anchor, i)]);
      setAnchor(null);
    }
    if (current) updateHighlight(current.id, anchor === null ? rangePatch(i, i) : rangePatch(Math.min(anchor, i), Math.max(anchor, i)));
  };
  const rangePatch = (a: number, b: number) => {
    const start = sentences[a].from;
    const stop = start + text.slice(start, sentences[b].to).trimEnd().length;
    return { char: start, to: stop, text: text.slice(start, stop).trim() };
  };

  const save = (color: HighlightColor, withNote = note) => {
    if (current) {
      updateHighlight(current.id, { color, note: withNote.trim() || undefined });
      return current;
    }
    const h = addHighlight({
      readerId,
      bookTitle: book.title,
      author: book.author,
      chapterTitle,
      chapter: at.chapter,
      para: at.para,
      char: from,
      to: end,
      text: selected,
      color,
      note: withNote.trim() || undefined,
    });
    setEditing(h.id);
    return h;
  };

  const done = () => {
    if (current && (current.note ?? '') !== note.trim()) updateHighlight(current.id, { note: note.trim() || undefined });
    else if (!current && note.trim()) save('yellow');
    onClose();
  };

  const toStash = (stashId: string) => {
    if (savedTo.includes(stashId)) return;
    const idea = saveClip({
      topicId,
      title: '',
      body: selected,
      author: book.author,
      cite: `${book.title}, ${chapterTitle}`.replace(/, $/, ''),
    });
    toggleInStash(stashId, idea.id);
    setSavedTo((s) => [...s, stashId]);
  };

  if (image) return <QuoteImage text={selected} author={book.author} source={book.title} onClose={() => setImage(false)} />;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={done}>
      <Pressable style={styles.backdrop} onPress={done}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          {word ? (
            <DefineCard word={word} language={language} onBack={() => setWord(null)} />
          ) : (
            <>
              <Text style={styles.title}>{current ? 'Edit highlight' : 'Highlight'}</Text>
              <View style={styles.modes}>
                {(['select', 'define'] as const).map((m) => (
                  <Pressable key={m} onPress={() => setMode(m)} style={[styles.mode, mode === m && styles.modeOn]}>
                    <Text style={[styles.modeText, mode === m && styles.modeTextOn]}>
                      {m === 'select' ? '✎ Select' : '📖 Look up a word'}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.hint}>
                {mode === 'define'
                  ? 'Tap any word to see what it means.'
                  : anchor === null
                    ? 'Tap a sentence to start a selection.'
                    : 'Tap another sentence to extend it.'}
              </Text>
              <ScrollView style={styles.passageBox}>
                <Text style={styles.passage}>
                  {mode === 'define'
                    ? text.split(/(\s+)/).map((w, i) =>
                        /\p{L}/u.test(w) ? (
                          <Text key={i} onPress={() => setWord(w)} style={styles.word}>
                            {w}
                          </Text>
                        ) : (
                          w
                        ),
                      )
                    : sentences.map((s, i) => {
                        const inRange = i >= range[0] && i <= range[1];
                        const hit = here.find((h) => h.char < s.to && h.to > s.from);
                        return (
                          <Text
                            key={s.from}
                            onPress={() => tapSentence(i)}
                            style={{
                              backgroundColor: hit ? HIGHLIGHT_COLORS[hit.color].fill : undefined,
                              opacity: inRange ? 1 : 0.45,
                              textDecorationLine: inRange ? 'underline' : 'none',
                              textDecorationColor: colors.accent,
                            }}>
                            {text.slice(s.from, s.to)}
                          </Text>
                        );
                      })}
                </Text>
              </ScrollView>

              <View style={styles.colors}>
                {(Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).map((c) => (
                  <Pressable
                    key={c}
                    accessibilityLabel={`Highlight ${HIGHLIGHT_COLORS[c].label}`}
                    onPress={() => save(c)}
                    style={[styles.swatch, { backgroundColor: HIGHLIGHT_COLORS[c].solid }, current?.color === c && styles.swatchOn]}>
                    {current?.color === c && <Text style={styles.check}>✓</Text>}
                  </Pressable>
                ))}
                {current && (
                  <Pressable
                    accessibilityLabel="Remove highlight"
                    onPress={() => {
                      removeHighlight(current.id);
                      setEditing(null);
                      setNote('');
                    }}
                    style={[styles.swatch, styles.clear]}>
                    <Text style={styles.clearText}>✕</Text>
                  </Pressable>
                )}
              </View>

              <TextInput
                accessibilityLabel="Note"
                value={note}
                onChangeText={setNote}
                placeholder="Add a note…"
                placeholderTextColor={colors.muted}
                multiline
                style={styles.note}
              />

              <View style={styles.actions}>
                <Pressable
                  onPress={async () => {
                    await copyText(`“${selected}” — ${book.author}, ${book.title}`);
                    setCopied(true);
                  }}
                  style={styles.action}>
                  <Text style={styles.actionText}>{copied ? '✓ Copied' : '⧉ Copy'}</Text>
                </Pressable>
                <Pressable accessibilityLabel="Share as image" onPress={() => setImage(true)} style={styles.action}>
                  <Text style={styles.actionText}>▣ Image</Text>
                </Pressable>
              </View>
            </>
          )}

          {!word && <Text style={styles.section}>Save to a stash</Text>}
          {!word && (
            <View style={styles.stashes}>
              {stashes.map((s) => (
                <Pressable key={s.id} onPress={() => toStash(s.id)} style={[styles.stash, savedTo.includes(s.id) && styles.stashOn]}>
                  <Text style={[styles.stashText, savedTo.includes(s.id) && { color: colors.onAccent }]}>
                    {savedTo.includes(s.id) ? '★' : '☆'} {s.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <Pressable onPress={done} style={styles.done}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    padding: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 12,
    maxHeight: '92%',
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  title: { color: colors.text, fontSize: 22, fontFamily: displayFont },
  hint: { color: colors.muted, fontSize: 13, marginTop: -6 },
  passageBox: { maxHeight: 200, borderRadius: 14, backgroundColor: '#FBF7EE', padding: 14 },
  passage: { color: '#1C1712', fontFamily: 'Literata_400Regular', fontSize: 16, lineHeight: 26 },
  modes: { flexDirection: 'row', gap: 8 },
  mode: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 999, backgroundColor: colors.surfaceRaised },
  modeOn: { backgroundColor: colors.text },
  modeText: { color: colors.text, fontWeight: '700', fontSize: 13 },
  modeTextOn: { color: colors.background },
  word: { textDecorationLine: 'underline', textDecorationStyle: 'dotted', textDecorationColor: '#B9A88A' },
  colors: { flexDirection: 'row', gap: 14, justifyContent: 'center' },
  swatch: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  swatchOn: { borderWidth: 3, borderColor: colors.text },
  check: { color: '#fff', fontWeight: '900', fontSize: 16 },
  clear: { backgroundColor: colors.surfaceRaised },
  clearText: { color: colors.text, fontWeight: '800' },
  note: {
    minHeight: 54,
    maxHeight: 120,
    borderRadius: 14,
    padding: 12,
    backgroundColor: colors.surfaceRaised,
    color: colors.text,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  actions: { flexDirection: 'row', gap: 10 },
  action: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 999, backgroundColor: colors.surfaceRaised },
  actionText: { color: colors.text, fontWeight: '700' },
  section: { color: colors.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 },
  stashes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stash: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: colors.surfaceRaised },
  stashOn: { backgroundColor: colors.accent },
  stashText: { color: colors.text, fontWeight: '600' },
  done: { alignItems: 'center', paddingVertical: 14, borderRadius: 999, backgroundColor: colors.accent },
  doneText: { color: colors.onAccent, fontWeight: '800' },
});
