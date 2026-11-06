import * as Speech from 'expo-speech';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { HANGUL_STROKES } from '@/data/learn/hangul-strokes';
import { courseById, type Course, type LItem, type Unit } from '@/data/learn/courses';
import { StrokePad } from '@/components/learn/StrokePad';
import { usePalette } from '@/lib/appearance';
import { sfx } from '@/lib/brain/sfx';
import { celebrate } from '@/lib/celebrate';
import { haptic } from '@/lib/haptics';
import { useUiLang } from '@/lib/i18n';
import { buildReview, buildSession, itemKey, type Step } from '@/lib/learn/session';
import { loadGlyph, type Glyph } from '@/lib/learn/strokes';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

const now = () => Date.now();
const shuffled = <T,>(xs: T[]) => [...xs].sort(() => Math.random() - 0.5);
const say = (text: string, voice: string, rate = 0.85) => {
  void Speech.stop();
  Speech.speak(text, { language: voice, rate });
};

// Hangul composition: initial consonants and vowels in Unicode order.
const INITIALS = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const MEDIALS = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
const compose = (c: string, v: string) => String.fromCharCode(0xac00 + (INITIALS.indexOf(c) * 21 + MEDIALS.indexOf(v)) * 28);

/** A short lesson: varied mini-games, instant feedback, mistakes come back at the end, then the results. */
export default function SessionScreen() {
  const { course: courseId, unit: unitId } = useLocalSearchParams<{ course: string; unit?: string }>();
  const course = courseById[courseId];
  const unit = course?.units.find((u) => u.id === unitId);
  const { learn, recordLearn } = useStore();
  const lang = useUiLang();
  const [steps, setSteps] = useState<Step[]>(() => {
    if (!course) return [];
    if (unit) return buildSession(course, unit, (learn?.units[unit.id]?.stars ?? 0) > 0);
    const due = Object.entries(learn?.items ?? {})
      .filter(([k, v]) => k.startsWith(`${course.id}:`) && new Date(v.due).getTime() <= now())
      .sort((a, b) => a[1].level - b[1].level)
      .map(([k]) => k);
    return buildReview(course, due);
  });
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<null | { ok: boolean; right: string }>(null);
  const [combo, setCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [graded, setGraded] = useState({ right: 0, total: 0 });
  const [done, setDone] = useState(false);
  const started = useRef(0);
  useEffect(() => {
    started.current = now();
  }, []);
  const retried = useRef(new Set<Step>());

  if (!course) return null;
  const step = steps[i];
  const unitOf = (item: LItem) => unit ?? course.units.find((u) => u.items.includes(item))!;
  const meaning = (it: LItem) => (lang === 'fr' ? it.fr : it.en);

  const grade = (ok: boolean, right: string) => {
    const item = 'item' in step ? step.item : null;
    if (ok) {
      const c = combo + 1;
      sfx.right(c);
      if (c >= 3 && c % 3 === 0) sfx.combo(c);
      haptic.tap();
      setCombo(c);
      setXp((x) => x + 10 + Math.min(10, c * 2));
    } else {
      sfx.wrong();
      haptic.tick();
      setCombo(0);
      // Mistakes come back once near the end of the lesson.
      if (!retried.current.has(step)) {
        const again = { ...step };
        retried.current.add(again);
        setSteps((s) => [...s, again]);
      }
    }
    if (item) {
      const key = itemKey(course, unitOf(item), item);
      setResults((r) => ({ ...r, [key]: (r[key] ?? true) && ok }));
    }
    setGraded((g) => ({ right: g.right + (ok ? 1 : 0), total: g.total + 1 }));
    setAnswer({ ok, right });
  };
  const next = () => {
    setAnswer(null);
    if (i + 1 >= steps.length) {
      const stars = graded.total ? (graded.right / graded.total >= 0.9 ? 3 : graded.right / graded.total >= 0.7 ? 2 : 1) : 3;
      recordLearn({ unit: unit?.id, stars, xp: xp + 20, seconds: Math.round((now() - started.current) / 1000), items: results });
      sfx.levelUp();
      if (stars === 3) celebrate({ emoji: '🌟', title: lang === 'fr' ? 'Parfait !' : 'Perfect!', subtitle: unit ? (lang === 'fr' ? unit.can.fr : unit.can.en) : '' });
      setDone(true);
    } else setI(i + 1);
  };

  if (!steps.length) {
    return (
      <View style={[styles.container, styles.center]}>
        <Stack.Screen options={{ title: course.name[lang] }} />
        <Text style={styles.big}>✅</Text>
        <Text style={styles.title}>{lang === 'fr' ? 'Rien à réviser pour l’instant' : 'Nothing to review right now'}</Text>
        <Pressable onPress={() => router.back()} style={[styles.primary, { backgroundColor: course.color }]}>
          <Text style={styles.primaryText}>OK</Text>
        </Pressable>
      </View>
    );
  }
  if (done) return <Finish course={course} unit={unit} xp={xp + 20} right={graded.right} total={graded.total} lang={lang} />;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: unit ? unit.title[lang] : lang === 'fr' ? 'Révision' : 'Review' }} />
      <View style={styles.hud}>
        <Pressable accessibilityLabel="Close lesson" onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${(i / steps.length) * 100}%`, backgroundColor: course.color }]} />
        </View>
        {combo >= 2 && (
          <Animated.Text key={combo} entering={ZoomIn} style={[styles.combo, { color: combo >= 6 ? '#FF6FB5' : combo >= 4 ? '#FFB547' : course.color }]}>
            🔥 {combo}
          </Animated.Text>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Animated.View key={i} entering={FadeIn.duration(220)} style={styles.stepWrap}>
          <StepView step={step} course={course} lang={lang} meaning={meaning} locked={!!answer} onGrade={grade} onNext={next} />
        </Animated.View>
      </ScrollView>
      {answer && (
        <Animated.View entering={FadeInDown.duration(200)} style={[styles.feedback, { backgroundColor: answer.ok ? 'rgba(61,220,151,0.16)' : 'rgba(229,72,77,0.16)' }]}>
          <Text style={[styles.feedbackTitle, { color: answer.ok ? '#2FAE77' : '#E5484D' }]}>{answer.ok ? (combo >= 3 ? `${lang === 'fr' ? 'Excellent' : 'Brilliant'} · 🔥 ${combo}` : lang === 'fr' ? 'Bien joué !' : 'Nice!') : lang === 'fr' ? 'Pas tout à fait' : 'Not quite'}</Text>
          {!answer.ok && !!answer.right && <Text style={styles.feedbackText}>{answer.right}</Text>}
          <Pressable accessibilityLabel="Continue" onPress={next} style={[styles.primary, { backgroundColor: answer.ok ? '#2FAE77' : '#E5484D' }]}>
            <Text style={styles.primaryText}>{lang === 'fr' ? 'Continuer' : 'Continue'}</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

type StepProps = { step: Step; course: Course; lang: 'en' | 'fr'; meaning: (it: LItem) => string; locked: boolean; onGrade: (ok: boolean, right: string) => void; onNext: () => void };

function StepView({ step, course, lang, meaning, locked, onGrade, onNext }: StepProps) {
  switch (step.type) {
    case 'learn':
      return <LearnStep item={step.item} course={course} lang={lang} meaning={meaning} onNext={onNext} />;
    case 'pick':
      return <PickStep step={step} course={course} lang={lang} meaning={meaning} locked={locked} onGrade={onGrade} />;
    case 'write':
      return <WriteStep item={step.item} mode={step.mode} course={course} lang={lang} locked={locked} onGrade={onGrade} />;
    case 'match':
      return <MatchStep items={step.items} course={course} lang={lang} meaning={meaning} locked={locked} onGrade={onGrade} />;
    case 'build':
      return <BuildStep item={step.item} tiles={step.tiles} course={course} lang={lang} meaning={meaning} locked={locked} onGrade={onGrade} />;
    case 'block':
      return <BlockStep step={step} course={course} lang={lang} locked={locked} onGrade={onGrade} />;
    case 'tone':
      return <ToneStep item={step.item} course={course} lang={lang} locked={locked} onGrade={onGrade} />;
    case 'spell':
      return <SpellStep item={step.item} options={step.options} course={course} lang={lang} meaning={meaning} locked={locked} onGrade={onGrade} />;
  }
}

/** Which stroke data a course's script item uses. */
function scriptOf(course: Course, item: LItem): 'kana' | 'hanzi' | 'hangul' | null {
  const u = course.units.find((x) => x.items.includes(item));
  return u?.script ?? null;
}
function useGlyph(course: Course, item: LItem) {
  const [glyph, setGlyph] = useState<Glyph | null>(null);
  const script = scriptOf(course, item);
  useEffect(() => {
    let alive = true;
    if (!script) return;
    const load = script === 'hangul' ? loadGlyph(item.text, 'own', HANGUL_STROKES) : loadGlyph(item.text, script);
    load.then((g) => alive && setGlyph(g));
    return () => {
      alive = false;
    };
  }, [item.text, script]);
  return { glyph, script };
}

function SoundButton({ text, course, big }: { text: string; course: Course; big?: boolean }) {
  return (
    <Pressable accessibilityLabel="Play sound" onPress={() => say(text, course.voice)} style={[styles.sound, big && styles.soundBig, { borderColor: course.color }]}>
      <Text style={[styles.soundText, big && { fontSize: 28 }]}>🔊</Text>
    </Pressable>
  );
}

function LearnStep({ item, course, lang, meaning, onNext }: { item: LItem; course: Course; lang: 'en' | 'fr'; meaning: (it: LItem) => string; onNext: () => void }) {
  const p = usePalette();
  const { width } = useWindowDimensions();
  const { glyph } = useGlyph(course, item);
  const [watched, setWatched] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => say(item.say ?? item.text, course.voice), 300);
    return () => clearTimeout(t);
  }, [item, course.voice]);
  const isWord = item.en !== item.roman;
  return (
    <View style={styles.center}>
      <Text style={[styles.kicker, { color: course.color }]}>{lang === 'fr' ? 'NOUVEAU' : 'NEW'}</Text>
      {glyph ? (
        <View style={[styles.padFrame, { borderColor: p.border }]}>
          <StrokePad glyph={glyph} mode="watch" size={Math.min(260, width - 80)} ink={p.text} accent={course.color} faint={p.border} onDone={() => setWatched(true)} />
        </View>
      ) : (
        <Text style={[styles.showText, item.text.length > 6 && { fontSize: 38 }]}>{item.text}</Text>
      )}
      {glyph && <Text style={styles.showSmall}>{item.text}</Text>}
      {!!item.roman && <Text style={[styles.roman, { color: course.color }]}>{item.roman}</Text>}
      {isWord && (
        <Text style={styles.meaning}>
          {item.emoji ? `${item.emoji}  ` : ''}
          {meaning(item)}
        </Text>
      )}
      <SoundButton text={item.say ?? item.text} course={course} big />
      <Pressable accessibilityLabel="Continue" disabled={!!glyph && !watched} onPress={onNext} style={[styles.primary, styles.wide, { backgroundColor: course.color }, glyph && !watched && { opacity: 0.4 }]}>
        <Text style={styles.primaryText}>{glyph ? (lang === 'fr' ? 'À vous d’écrire' : 'Now you write it') : lang === 'fr' ? 'Compris' : 'Got it'}</Text>
      </Pressable>
    </View>
  );
}

function Options({ options, render, correct, locked, onPick, columns = 2 }: { options: LItem[]; render: (o: LItem) => string; correct: LItem; locked: boolean; onPick: (o: LItem) => void; columns?: number }) {
  const [picked, setPicked] = useState<LItem | null>(null);
  return (
    <View style={[styles.options, columns === 2 && styles.grid]}>
      {options.map((o) => {
        const state = picked ? (o === correct ? 'right' : o === picked ? 'wrong' : 'dim') : null;
        return (
          <Pressable
            key={o.text + render(o)}
            accessibilityLabel={`Option ${render(o)}`}
            disabled={locked}
            onPress={() => {
              setPicked(o);
              onPick(o);
            }}
            style={({ pressed }) => [styles.option, columns === 2 && styles.half, pressed && styles.pressed, state === 'right' && styles.right, state === 'wrong' && styles.wrong, state === 'dim' && { opacity: 0.45 }]}>
            <Text style={[styles.optionText, render(o).length <= 3 && styles.optionBig]}>{render(o)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PickStep({ step, course, lang, meaning, locked, onGrade }: { step: Extract<Step, { type: 'pick' }>; course: Course; lang: 'en' | 'fr'; meaning: (it: LItem) => string; locked: boolean; onGrade: (ok: boolean, right: string) => void }) {
  const { item, ask, options } = step;
  useEffect(() => {
    if (ask === 'listen') {
      const t = setTimeout(() => say(item.say ?? item.text, course.voice), 250);
      return () => clearTimeout(t);
    }
  }, [ask, item, course.voice]);
  const render = (o: LItem) => (ask === 'sound' ? o.roman ?? '' : ask === 'meaning' ? `${o.emoji ?? ''} ${meaning(o)}`.trim() : o.text);
  const prompt =
    ask === 'listen' ? (lang === 'fr' ? 'Qu’avez-vous entendu ?' : 'What did you hear?') : ask === 'sound' ? (lang === 'fr' ? 'Comment ça se lit ?' : 'How does this sound?') : lang === 'fr' ? 'Que veut dire… ?' : 'What does this mean?';
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{prompt}</Text>
      {ask === 'listen' ? (
        <SoundButton text={item.say ?? item.text} course={course} big />
      ) : (
        <>
          <Text style={[styles.showText, item.text.length > 6 && { fontSize: 36 }]}>{item.text}</Text>
          {ask === 'meaning' && <SoundButton text={item.say ?? item.text} course={course} />}
        </>
      )}
      <Options options={options} render={render} correct={item} locked={locked} onPick={(o) => onGrade(o === item, `${item.text} · ${item.roman ?? ''}${ask === 'meaning' ? ` · ${meaning(item)}` : ''}`)} columns={ask === 'meaning' ? 1 : 2} />
    </View>
  );
}

function WriteStep({ item, mode, course, lang, locked, onGrade }: { item: LItem; mode: 'trace' | 'hint' | 'free'; course: Course; lang: 'en' | 'fr'; locked: boolean; onGrade: (ok: boolean, right: string) => void }) {
  const p = usePalette();
  const { width } = useWindowDimensions();
  const { glyph } = useGlyph(course, item);
  const prompt =
    mode === 'trace'
      ? lang === 'fr' ? 'Tracez en suivant le modèle' : 'Trace over the guide'
      : mode === 'hint'
        ? lang === 'fr' ? `Écrivez « ${item.roman} »` : `Write “${item.roman}”`
        : lang === 'fr' ? `De mémoire : « ${item.roman} »` : `From memory: “${item.roman}”`;
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{prompt}</Text>
      {mode !== 'trace' && item.en !== item.roman && <Text style={styles.meaning}>{lang === 'fr' ? item.fr : item.en}</Text>}
      {glyph ? (
        <View style={[styles.padFrame, { borderColor: course.color }]}>
          <StrokePad
            glyph={glyph}
            mode={mode}
            size={Math.min(300, width - 64)}
            ink={p.text}
            accent={course.color}
            faint={p.border}
            onDone={(mistakes) => !locked && onGrade(mistakes <= (mode === 'free' ? 1 : 2), `${item.text} · ${item.roman}`)}
          />
        </View>
      ) : (
        <Text style={styles.prompt}>…</Text>
      )}
      <SoundButton text={item.say ?? item.text} course={course} />
    </View>
  );
}

function MatchStep({ items, course, lang, meaning, locked, onGrade }: { items: LItem[]; course: Course; lang: 'en' | 'fr'; meaning: (it: LItem) => string; locked: boolean; onGrade: (ok: boolean, right: string) => void }) {
  const right = useMemo(() => shuffled(items), [items]);
  const [sel, setSel] = useState<LItem | null>(null);
  const [matched, setMatched] = useState<LItem[]>([]);
  const [misses, setMisses] = useState(0);
  const [wrong, setWrong] = useState<LItem | null>(null);
  const [left, setLeft] = useState(30);
  const label = (o: LItem) => (o.en === o.roman ? o.roman ?? '' : `${o.emoji ?? ''} ${meaning(o)}`.trim());
  useEffect(() => {
    if (locked) return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [locked]);
  const finished = matched.length === items.length || left <= 0;
  useEffect(() => {
    if (!finished || locked) return;
    const t = setTimeout(() => onGrade(matched.length === items.length && misses <= 1, left <= 0 ? (lang === 'fr' ? 'Temps écoulé' : 'Time’s up') : ''), 250);
    return () => clearTimeout(t);
    // Reacting to the end of the round.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);
  const tapRight = (o: LItem) => {
    if (!sel || matched.includes(o)) return;
    if (o === sel) {
      sfx.click();
      say(o.say ?? o.text, course.voice, 1);
      setMatched((m) => [...m, o]);
    } else {
      sfx.wrong();
      setMisses((m) => m + 1);
      setWrong(o);
      setTimeout(() => setWrong(null), 350);
    }
    setSel(null);
  };
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{lang === 'fr' ? 'Reliez les paires' : 'Match the pairs'}</Text>
      <Text style={[styles.timer, { color: left <= 8 ? '#E5484D' : course.color }]}>⏱ {Math.max(0, left)} s</Text>
      <View style={styles.matchCols}>
        <View style={styles.matchCol}>
          {items.map((o) => (
            <Pressable key={o.text} accessibilityLabel={`Left ${o.text}`} disabled={matched.includes(o)} onPress={() => setSel(o)} style={[styles.matchCell, sel === o && { borderColor: course.color, backgroundColor: `${course.color}22` }, matched.includes(o) && styles.matchedCell]}>
              <Text style={[styles.matchText, o.text.length <= 2 && { fontSize: 26 }]}>{o.text}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.matchCol}>
          {right.map((o) => (
            <Pressable key={o.text} accessibilityLabel={`Right ${label(o)}`} disabled={matched.includes(o)} onPress={() => tapRight(o)} style={[styles.matchCell, matched.includes(o) && styles.matchedCell, wrong === o && styles.wrong]}>
              <Text style={styles.matchText}>{label(o)}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

function BuildStep({ item, tiles, course, lang, meaning, locked, onGrade }: { item: LItem; tiles: string[]; course: Course; lang: 'en' | 'fr'; meaning: (it: LItem) => string; locked: boolean; onGrade: (ok: boolean, right: string) => void }) {
  const [chosen, setChosen] = useState<number[]>([]);
  const target = item.tiles ?? [];
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{lang === 'fr' ? 'Construisez :' : 'Build it:'}</Text>
      <Text style={styles.meaning}>
        {item.emoji ? `${item.emoji}  ` : ''}
        {meaning(item)}
      </Text>
      <SoundButton text={item.say ?? item.text} course={course} />
      <View style={[styles.answerRow, course.rtl && { flexDirection: 'row-reverse' }]}>
        {chosen.length ? (
          chosen.map((k, n) => (
            <Pressable key={`${k}-${n}`} accessibilityLabel={`Remove ${tiles[k]}`} disabled={locked} onPress={() => setChosen((c) => c.filter((_, m) => m !== n))} style={[styles.tile, { borderColor: course.color }]}>
              <Text style={styles.tileText}>{tiles[k]}</Text>
            </Pressable>
          ))
        ) : (
          <Text style={styles.placeholder}>{lang === 'fr' ? 'Touchez les pièces dans l’ordre' : 'Tap the pieces in order'}</Text>
        )}
      </View>
      <View style={styles.tiles}>
        {tiles.map((t, k) => (
          <Pressable
            key={`${t}-${k}`}
            accessibilityLabel={`Tile ${t}`}
            disabled={locked || chosen.includes(k)}
            onPress={() => {
              sfx.click();
              setChosen((c) => [...c, k]);
            }}
            style={[styles.tile, chosen.includes(k) && { opacity: 0.25 }]}>
            <Text style={styles.tileText}>{t}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        accessibilityLabel="Check"
        disabled={locked || !chosen.length}
        onPress={() => onGrade(chosen.map((k) => tiles[k]).join('|') === target.join('|'), `${item.text} · ${item.roman ?? ''}`)}
        style={[styles.primary, styles.wide, { backgroundColor: course.color }, !chosen.length && { opacity: 0.4 }]}>
        <Text style={styles.primaryText}>{lang === 'fr' ? 'Vérifier' : 'Check'}</Text>
      </Pressable>
    </View>
  );
}

function BlockStep({ step, course, lang, locked, onGrade }: { step: Extract<Step, { type: 'block' }>; course: Course; lang: 'en' | 'fr'; locked: boolean; onGrade: (ok: boolean, right: string) => void }) {
  const { item } = step;
  const [c, setC] = useState<string | null>(null);
  const [v, setV] = useState<string | null>(null);
  useEffect(() => {
    const t = setTimeout(() => say(item.text, course.voice), 250);
    return () => clearTimeout(t);
  }, [item, course.voice]);
  const built = c && v ? compose(c, v) : c ?? v ?? '';
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{lang === 'fr' ? `Assemblez la syllabe « ${item.roman} »` : `Build the syllable “${item.roman}”`}</Text>
      <SoundButton text={item.text} course={course} />
      <Animated.View key={built} entering={ZoomIn.duration(180)} style={[styles.blockBox, { borderColor: course.color }]}>
        <Text style={styles.blockText}>{built || '?'}</Text>
      </Animated.View>
      <Text style={styles.label}>{lang === 'fr' ? '1. Consonne' : '1. Consonant'}</Text>
      <View style={styles.tiles}>
        {step.consonants.map((x) => (
          <Pressable key={x} accessibilityLabel={`Consonant ${x}`} disabled={locked} onPress={() => (sfx.click(), setC(x))} style={[styles.tile, styles.jamo, c === x && { borderColor: course.color, backgroundColor: `${course.color}22` }]}>
            <Text style={styles.jamoText}>{x}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>{lang === 'fr' ? '2. Voyelle' : '2. Vowel'}</Text>
      <View style={styles.tiles}>
        {step.vowels.map((x) => (
          <Pressable key={x} accessibilityLabel={`Vowel ${x}`} disabled={locked} onPress={() => (sfx.click(), setV(x))} style={[styles.tile, styles.jamo, v === x && { borderColor: course.color, backgroundColor: `${course.color}22` }]}>
            <Text style={styles.jamoText}>{x}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable accessibilityLabel="Check" disabled={locked || !c || !v} onPress={() => onGrade(c === item.parts![0] && v === item.parts![1], `${item.text} = ${item.parts![0]} + ${item.parts![1]}`)} style={[styles.primary, styles.wide, { backgroundColor: course.color }, (!c || !v) && { opacity: 0.4 }]}>
        <Text style={styles.primaryText}>{lang === 'fr' ? 'Vérifier' : 'Check'}</Text>
      </Pressable>
    </View>
  );
}

/** The four Mandarin tone contours, drawn as pitch lines. */
const TONE_PATHS = ['M8,12 L72,12', 'M8,44 L72,10', 'M8,24 Q30,58 52,46 T72,14', 'M8,10 L72,50'];
function ToneStep({ item, course, lang, locked, onGrade }: { item: LItem; course: Course; lang: 'en' | 'fr'; locked: boolean; onGrade: (ok: boolean, right: string) => void }) {
  const p = usePalette();
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => {
    const t = setTimeout(() => say(item.text, course.voice, 0.7), 250);
    return () => clearTimeout(t);
  }, [item, course.voice]);
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{lang === 'fr' ? 'Quel ton entendez-vous ?' : 'Which tone do you hear?'}</Text>
      <SoundButton text={item.text} course={course} big />
      <Text style={styles.showSmall}>{item.text}</Text>
      <View style={[styles.options, styles.grid]}>
        {[1, 2, 3, 4].map((t) => {
          const state = picked === null ? null : t === item.tone ? 'right' : t === picked ? 'wrong' : 'dim';
          return (
            <Pressable
              key={t}
              accessibilityLabel={`Tone ${t}`}
              disabled={locked}
              onPress={() => {
                setPicked(t);
                onGrade(t === item.tone, `${item.text} · ${item.roman} (${lang === 'fr' ? 'ton' : 'tone'} ${item.tone})`);
              }}
              style={[styles.option, styles.half, state === 'right' && styles.right, state === 'wrong' && styles.wrong, state === 'dim' && { opacity: 0.45 }]}>
              <Svg width={80} height={60} viewBox="0 0 80 60">
                <Path d={TONE_PATHS[t - 1]} stroke={p.text} strokeWidth={5} strokeLinecap="round" fill="none" />
              </Svg>
              <Text style={styles.optionText}>{['ā', 'á', 'ǎ', 'à'][t - 1]} · {t}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SpellStep({ item, options, course, lang, meaning, locked, onGrade }: { item: LItem; options: string[]; course: Course; lang: 'en' | 'fr'; meaning: (it: LItem) => string; locked: boolean; onGrade: (ok: boolean, right: string) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{lang === 'fr' ? 'Quelle est la bonne orthographe ?' : 'Which spelling is right?'}</Text>
      <Text style={styles.meaning}>
        {item.emoji ? `${item.emoji}  ` : ''}
        {meaning(item)}
      </Text>
      <SoundButton text={item.text} course={course} big />
      <View style={styles.options}>
        {options.map((o) => {
          const state = picked === null ? null : o === item.text ? 'right' : o === picked ? 'wrong' : 'dim';
          return (
            <Pressable
              key={o}
              accessibilityLabel={`Option ${o}`}
              disabled={locked}
              onPress={() => {
                setPicked(o);
                onGrade(o === item.text, `${item.text} · ${item.roman}`);
              }}
              style={[styles.option, state === 'right' && styles.right, state === 'wrong' && styles.wrong, state === 'dim' && { opacity: 0.45 }]}>
              <Text style={[styles.optionText, { fontSize: 22 }]}>{o}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Finish({ course, unit, xp, right, total, lang }: { course: Course; unit?: Unit; xp: number; right: number; total: number; lang: 'en' | 'fr' }) {
  const acc = total ? right / total : 1;
  const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
  const nextUnit = unit ? course.units[course.units.indexOf(unit) + 1] : undefined;
  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.body, styles.center]}>
      <Stack.Screen options={{ title: course.name[lang] }} />
      <Animated.Text entering={ZoomIn.springify().damping(9)} style={styles.big}>
        {course.flag}
      </Animated.Text>
      <Text style={styles.title}>{lang === 'fr' ? 'Leçon terminée' : 'Lesson complete'}</Text>
      <Animated.Text entering={ZoomIn.delay(300).springify()} style={[styles.stars, { color: course.color }]}>
        {'★'.repeat(stars)}
        <Text style={{ color: colors.border }}>{'★'.repeat(3 - stars)}</Text>
      </Animated.Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: course.color }]}>+{xp}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: course.color }]}>{Math.round(acc * 100)}%</Text>
          <Text style={styles.statLabel}>{lang === 'fr' ? 'Justesse' : 'Accuracy'}</Text>
        </View>
      </View>
      {unit && (
        <View style={[styles.canDo, { borderColor: course.color }]}>
          <Text style={[styles.kicker, { color: course.color }]}>{lang === 'fr' ? 'VOUS SAVEZ MAINTENANT' : 'YOU CAN NOW'}</Text>
          <Text style={styles.canDoText}>✓ {unit.can[lang]}</Text>
        </View>
      )}
      {nextUnit && (
        <Pressable accessibilityLabel="Next unit" onPress={() => router.replace({ pathname: '/learn/session', params: { course: course.id, unit: nextUnit.id } })} style={[styles.primary, styles.wide, { backgroundColor: course.color }]}>
          <Text style={styles.primaryText}>
            {lang === 'fr' ? 'Suivant :' : 'Next:'} {nextUnit.icon} {nextUnit.title[lang]}
          </Text>
        </Pressable>
      )}
      {unit && (
        <Pressable accessibilityLabel="Again" onPress={() => router.replace({ pathname: '/learn/session', params: { course: course.id, unit: unit.id } })} style={[styles.secondary, styles.wide]}>
          <Text style={styles.secondaryText}>{lang === 'fr' ? 'Refaire' : 'Play again'}</Text>
        </Pressable>
      )}
      <Pressable accessibilityLabel="Done" onPress={() => router.back()} style={[styles.secondary, styles.wide]}>
        <Text style={styles.secondaryText}>{lang === 'fr' ? 'Terminé' : 'Done'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, paddingBottom: 220, maxWidth: 560, width: '100%', alignSelf: 'center' },
  stepWrap: { gap: 14 },
  center: { alignItems: 'center', gap: 14 },
  hud: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 10, maxWidth: 560, width: '100%', alignSelf: 'center' },
  close: { color: colors.muted, fontSize: 20, fontWeight: '800', width: 28 },
  track: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  fill: { height: 10, borderRadius: 5 },
  combo: { fontWeight: '900', fontSize: 15 },
  kicker: { fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  title: { color: colors.text, fontSize: 26, fontWeight: '900', textAlign: 'center' },
  big: { fontSize: 64 },
  prompt: { color: colors.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  showText: { color: colors.text, fontSize: 64, fontWeight: '700', textAlign: 'center' },
  showSmall: { color: colors.muted, fontSize: 22 },
  roman: { fontSize: 22, fontWeight: '900' },
  meaning: { color: colors.text, fontSize: 18, textAlign: 'center' },
  padFrame: { borderWidth: 2, borderRadius: 20, overflow: 'hidden', backgroundColor: colors.surface },
  sound: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  soundBig: { width: 84, height: 84, borderRadius: 42 },
  soundText: { fontSize: 20 },
  options: { gap: 10, alignSelf: 'stretch' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  option: { minHeight: 56, borderRadius: 16, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', padding: 12 },
  half: { width: '48%', flexGrow: 1 },
  pressed: { transform: [{ scale: 0.97 }] },
  optionText: { color: colors.text, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  optionBig: { fontSize: 28 },
  right: { borderColor: '#2FAE77', backgroundColor: 'rgba(61,220,151,0.15)' },
  wrong: { borderColor: '#E5484D', backgroundColor: 'rgba(229,72,77,0.15)' },
  primary: { minHeight: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  primaryText: { color: '#0B0D14', fontWeight: '900', fontSize: 16 },
  secondary: { minHeight: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  secondaryText: { color: colors.text, fontWeight: '800', fontSize: 15 },
  wide: { alignSelf: 'stretch' },
  feedback: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 18, paddingBottom: 34, gap: 10, borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  feedbackTitle: { fontSize: 20, fontWeight: '900' },
  feedbackText: { color: colors.text, fontSize: 16 },
  timer: { fontWeight: '900', fontSize: 16 },
  matchCols: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  matchCol: { flex: 1, gap: 8 },
  matchCell: { minHeight: 56, borderRadius: 14, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', padding: 8 },
  matchedCell: { opacity: 0.25, borderColor: '#2FAE77' },
  matchText: { color: colors.text, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  answerRow: { minHeight: 64, alignSelf: 'stretch', flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 10, borderBottomWidth: 2, borderBottomColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  placeholder: { color: colors.muted },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  tile: { minHeight: 48, minWidth: 48, paddingHorizontal: 14, borderRadius: 12, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  tileText: { color: colors.text, fontSize: 20, fontWeight: '800' },
  label: { color: colors.muted, fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  blockBox: { width: 110, height: 110, borderRadius: 20, borderWidth: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  blockText: { color: colors.text, fontSize: 64, fontWeight: '700' },
  jamo: { width: 64, height: 64 },
  jamoText: { color: colors.text, fontSize: 30, fontWeight: '700' },
  stars: { fontSize: 40, letterSpacing: 6 },
  statsRow: { flexDirection: 'row', gap: 12 },
  stat: { minWidth: 110, padding: 12, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  canDo: { alignSelf: 'stretch', borderWidth: 2, borderRadius: 18, padding: 16, gap: 6 },
  canDoText: { color: colors.text, fontSize: 17, fontWeight: '800' },
});
