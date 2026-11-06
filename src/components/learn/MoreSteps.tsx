import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { castOf, SceneBanner } from '@/components/learn/Cast';
import { MemoryStep, PictureOfStep, PictureStep, SceneStep, SpeedStep } from '@/components/learn/Games';
import { Pic } from '@/components/learn/Pic';
import type { Course, LItem } from '@/data/learn/courses';
import { sfx } from '@/lib/brain/sfx';
import type { FullStep } from '@/lib/learn/lessons';
import { canListen, listenOnce, sameAnswer, say, similarity } from '@/lib/learn/speech';
import { colors } from '@/lib/theme';

/** Shuffled copy (outside render so the component stays pure). */
function mix<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Props = { step: FullStep; course: Course; lang: 'en' | 'fr'; locked: boolean; onGrade: (ok: boolean, right: string) => void; onNext: () => void };

/** The full-course activities: grammar notes, gaps, listening, speaking, dictation, role-play, stories, questions. */
export function MoreStep({ step, course, lang, locked, onGrade, onNext }: Props) {
  const fr = lang === 'fr';
  switch (step.type) {
    case 'note':
      return <NoteStep step={step} course={course} fr={fr} onNext={onNext} />;
    case 'gap':
      return <GapStep step={step} course={course} fr={fr} locked={locked} onGrade={onGrade} />;
    case 'listenq':
      return <ListenQ step={step} course={course} fr={fr} locked={locked} onGrade={onGrade} />;
    case 'speak':
      return <SpeakStep step={step} course={course} fr={fr} locked={locked} onGrade={onGrade} onNext={onNext} />;
    case 'dictation':
      return <Dictation step={step} course={course} fr={fr} locked={locked} onGrade={onGrade} />;
    case 'dialogue':
      return <DialogueStep step={step} course={course} fr={fr} locked={locked} onGrade={onGrade} />;
    case 'story':
      return <StoryStep step={step} course={course} fr={fr} onNext={onNext} />;
    case 'picture':
      return <PictureStep step={step} course={course} fr={fr} locked={locked} onGrade={onGrade} />;
    case 'pictureOf':
      return <PictureOfStep step={step} course={course} fr={fr} locked={locked} onGrade={onGrade} />;
    case 'memory':
      return <MemoryStep step={step} course={course} fr={fr} locked={locked} onGrade={onGrade} />;
    case 'speed':
      return <SpeedStep step={step} course={course} fr={fr} locked={locked} onGrade={onGrade} />;
    case 'scene':
      return <SceneStep step={step} course={course} fr={fr} locked={locked} onGrade={onGrade} />;
    case 'question':
      return <Choice prompt={fr ? step.prompt.fr : step.prompt.en} options={step.options} answer={step.answer} course={course} locked={locked} onGrade={onGrade} />;
    default:
      return null;
  }
}

function Speaker({ text, course, big }: { text: string; course: Course; big?: boolean }) {
  return (
    <Pressable accessibilityLabel="Play sound" onPress={() => say(text, course.voice)} style={[styles.sound, big && styles.soundBig, { borderColor: course.color }]}>
      <Text style={{ fontSize: big ? 28 : 20 }}>🔊</Text>
    </Pressable>
  );
}

function Choice({ prompt, options, answer, course, locked, onGrade, sub }: { prompt: string; options: string[]; answer: string; course: Course; locked: boolean; onGrade: (ok: boolean, right: string) => void; sub?: string }) {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{prompt}</Text>
      {!!sub && <Text style={styles.sub}>{sub}</Text>}
      <View style={styles.options}>
        {options.map((o) => {
          const state = picked === null ? null : o === answer ? 'right' : o === picked ? 'wrong' : 'dim';
          return (
            <Pressable
              key={o}
              accessibilityLabel={`Option ${o}`}
              disabled={locked}
              onPress={() => {
                setPicked(o);
                onGrade(o === answer, answer);
              }}
              style={[styles.option, state === 'right' && styles.right, state === 'wrong' && styles.wrong, state === 'dim' && { opacity: 0.45 }]}>
              <Text style={styles.optionText}>{o}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ height: 1 }} accessibilityLabel={course.id} />
    </View>
  );
}

function NoteStep({ step, course, fr, onNext }: { step: Extract<FullStep, { type: 'note' }>; course: Course; fr: boolean; onNext: () => void }) {
  return (
    <View style={styles.center}>
      <Text style={[styles.kicker, { color: course.color }]}>
        {fr ? 'GRAMMAIRE' : 'GRAMMAR'} · {step.index + 1}/{step.total}
      </Text>
      <View style={[styles.note, { borderColor: course.color }]}>
        <Text style={styles.noteText}>{fr ? step.card.fr : step.card.en}</Text>
        {step.card.examples.map(([t, en, frx]) => (
          <Pressable key={t} accessibilityLabel={`Example ${t}`} onPress={() => say(t, course.voice)} style={styles.example}>
            <Text style={[styles.exampleText, { color: course.color }]}>🔊 {t}</Text>
            <Text style={styles.sub}>{fr ? frx : en}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable accessibilityLabel="Continue" onPress={onNext} style={[styles.primary, { backgroundColor: course.color }]}>
        <Text style={styles.primaryText}>{fr ? 'Compris' : 'Got it'}</Text>
      </Pressable>
    </View>
  );
}

function GapStep({ step, course, fr, locked, onGrade }: { step: Extract<FullStep, { type: 'gap' }>; course: Course; fr: boolean; locked: boolean; onGrade: (ok: boolean, right: string) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const full = step.text.replace('___', step.answer);
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{fr ? 'Complétez la phrase' : 'Fill in the gap'}</Text>
      <Text style={styles.sentence}>
        {step.text.split('___').map((part, i, arr) => (
          <Text key={i}>
            {part}
            {i < arr.length - 1 && <Text style={[styles.slot, { color: picked ? (picked === step.answer ? '#2FAE77' : '#E5484D') : course.color }]}>{picked ?? '____'}</Text>}
          </Text>
        ))}
      </Text>
      <Text style={styles.sub}>{fr ? step.fr : step.en}</Text>
      <View style={[styles.options, styles.row]}>
        {step.options.map((o) => (
          <Pressable
            key={o}
            accessibilityLabel={`Option ${o}`}
            disabled={locked}
            onPress={() => {
              setPicked(o);
              say(step.text.replace('___', o), course.voice, 0.9);
              onGrade(o === step.answer, full);
            }}
            style={[styles.chip, picked === o && (o === step.answer ? styles.right : styles.wrong)]}>
            <Text style={styles.optionText}>{o}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ListenQ({ step, course, fr, locked, onGrade }: { step: Extract<FullStep, { type: 'listenq' }>; course: Course; fr: boolean; locked: boolean; onGrade: (ok: boolean, right: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => say(step.item.ex!, course.voice, 0.85), 300);
    return () => clearTimeout(t);
  }, [step.item, course.voice]);
  const tr = (it: LItem) => (fr ? it.exFr ?? it.exEn ?? '' : it.exEn ?? '');
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{fr ? 'Écoutez : que veut dire la phrase ?' : 'Listen: what does it mean?'}</Text>
      <Speaker text={step.item.ex!} course={course} big />
      <Choice prompt="" options={step.options.map(tr)} answer={tr(step.item)} course={course} locked={locked} onGrade={(ok) => onGrade(ok, `${step.item.ex} · ${tr(step.item)}`)} />
    </View>
  );
}

function SpeakStep({ step, course, fr, locked, onGrade, onNext }: { step: Extract<FullStep, { type: 'speak' }>; course: Course; fr: boolean; locked: boolean; onGrade: (ok: boolean, right: string) => void; onNext: () => void }) {
  const [state, setState] = useState<'idle' | 'listening' | 'heard' | 'error'>('idle');
  const [heard, setHeard] = useState('');
  const [score, setScore] = useState(0);
  const stop = useRef<() => void>(() => {});
  const supported = canListen();
  useEffect(() => () => stop.current(), []);
  const start = () => {
    setState('listening');
    sfx.click();
    const r = listenOnce(course.voice);
    stop.current = r.stop;
    r.result.then(
      (alts) => {
        const best = alts.map((a) => ({ a, s: similarity(a, step.phrase) })).sort((x, y) => y.s - x.s)[0];
        setHeard(best.a);
        setScore(best.s);
        setState('heard');
        if (!locked) onGrade(best.s >= 0.7, step.phrase);
      },
      () => setState('error'),
    );
  };
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{fr ? 'Dites-le à voix haute' : 'Say it out loud'}</Text>
      <Text style={styles.sentence}>{step.phrase}</Text>
      <Text style={styles.sub}>{step.phrase === step.item.text ? (fr ? step.item.fr : step.item.en) : fr ? step.item.exFr : step.item.exEn}</Text>
      <Speaker text={step.phrase} course={course} />
      {supported ? (
        <>
          <Pressable accessibilityLabel="Speak" disabled={state === 'listening' || locked} onPress={start} style={[styles.mic, { backgroundColor: state === 'listening' ? '#E5484D' : course.color }]}>
            <Text style={styles.micText}>{state === 'listening' ? '●' : '🎤'}</Text>
          </Pressable>
          <Text style={styles.sub}>
            {state === 'listening' ? (fr ? 'Je vous écoute…' : 'Listening…') : state === 'heard' ? `${fr ? 'Entendu' : 'Heard'} : “${heard}” · ${Math.round(score * 100)}%` : state === 'error' ? (fr ? 'Je n’ai rien entendu. Réessayez.' : 'I didn’t catch that. Try again.') : fr ? 'Touchez le micro et parlez' : 'Tap the mic and speak'}
          </Text>
        </>
      ) : (
        <Text style={styles.sub}>{fr ? 'La reconnaissance vocale n’est pas disponible ici. Dites-le à voix haute, puis continuez.' : 'Speech recognition isn’t available here. Say it out loud, then continue.'}</Text>
      )}
      {(!supported || state === 'error') && (
        <Pressable accessibilityLabel="Skip speaking" onPress={onNext} style={styles.secondary}>
          <Text style={styles.secondaryText}>{fr ? 'Passer' : 'Skip'}</Text>
        </Pressable>
      )}
    </View>
  );
}

function Dictation({ step, course, fr, locked, onGrade }: { step: Extract<FullStep, { type: 'dictation' }>; course: Course; fr: boolean; locked: boolean; onGrade: (ok: boolean, right: string) => void }) {
  const [text, setText] = useState('');
  useEffect(() => {
    const t = setTimeout(() => say(step.item.text, course.voice, 0.8), 300);
    return () => clearTimeout(t);
  }, [step.item, course.voice]);
  return (
    <View style={styles.center}>
      <Text style={styles.prompt}>{fr ? 'Dictée : écrivez ce que vous entendez' : 'Dictation: type what you hear'}</Text>
      <Speaker text={step.item.text} course={course} big />
      <TextInput
        accessibilityLabel="Dictation answer"
        value={text}
        onChangeText={setText}
        editable={!locked}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={fr ? 'Votre réponse' : 'Your answer'}
        placeholderTextColor={colors.muted}
        style={[styles.input, { borderColor: course.color }]}
      />
      <Pressable accessibilityLabel="Check" disabled={locked || !text.trim()} onPress={() => onGrade(sameAnswer(text, step.item.text), `${step.item.text} · ${fr ? step.item.fr : step.item.en}`)} style={[styles.primary, { backgroundColor: course.color }, !text.trim() && { opacity: 0.4 }]}>
        <Text style={styles.primaryText}>{fr ? 'Vérifier' : 'Check'}</Text>
      </Pressable>
    </View>
  );
}

function DialogueStep({ step, course, fr, locked, onGrade }: { step: Extract<FullStep, { type: 'dialogue' }>; course: Course; fr: boolean; locked: boolean; onGrade: (ok: boolean, right: string) => void }) {
  const lines = step.dialogue.lines;
  const [n, setN] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wrongPick, setWrongPick] = useState<string | null>(null);
  const line = lines[n];
  const partner = castOf(course, step.dialogue.id)[0];
  const options = useMemo(() => (line && line.who === 'B' ? mix([line.text, ...(line.wrong ?? [])]) : []), [line]);
  // Partner lines are spoken, then the conversation moves on.
  useEffect(() => {
    if (!line || line.who !== 'A') return;
    say(line.text, course.voice, 0.9);
    const t = setTimeout(() => setN((x) => x + 1), Math.max(1800, line.text.length * 70));
    return () => clearTimeout(t);
  }, [line, course.voice]);
  useEffect(() => {
    if (n < lines.length || locked) return;
    const t = setTimeout(() => onGrade(mistakes === 0, fr ? 'Relisez la conversation et réessayez.' : 'Read the conversation again and retry.'), 400);
    return () => clearTimeout(t);
    // When the conversation ends.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);
  return (
    <View style={styles.dialogue}>
      <SceneBanner course={course} id={step.dialogue.id} icon={step.dialogue.icon} title={fr ? step.dialogue.fr : step.dialogue.en} fr={fr} />
      {lines.slice(0, n).map((l, i) =>
        l.who === 'B' ? (
          <Animated.View key={i} entering={FadeInDown.duration(220)} style={[styles.bubble, styles.me, { backgroundColor: `${course.color}33` }]}>
            <Text style={styles.bubbleText}>{l.text}</Text>
            <Text style={styles.sub}>{fr ? l.fr : l.en}</Text>
          </Animated.View>
        ) : (
          <Animated.View key={i} entering={FadeInDown.duration(220)} style={styles.themRow}>
            <Pic emoji={partner?.emoji ?? '🙂'} size={34} />
            <View style={[styles.bubble, styles.them]}>
              {!!partner && <Text style={[styles.who, { color: course.color }]}>{partner.name}</Text>}
              <Text style={styles.bubbleText}>{l.text}</Text>
              <Text style={styles.sub}>{fr ? l.fr : l.en}</Text>
            </View>
          </Animated.View>
        ),
      )}
      {line && line.who === 'A' && (
        <Animated.View entering={FadeIn} style={styles.themRow}>
          <Pic emoji={partner?.emoji ?? '🙂'} size={34} />
          <View style={[styles.bubble, styles.them]}>
            {!!partner && <Text style={[styles.who, { color: course.color }]}>{partner.name}</Text>}
            <Text style={styles.bubbleText}>{line.text}</Text>
            <Text style={styles.sub}>{fr ? line.fr : line.en}</Text>
          </View>
        </Animated.View>
      )}
      {line && line.who === 'B' && (
        <View style={styles.options}>
          <Text style={styles.prompt}>{step.speakIt ? (fr ? 'Votre réplique (dites-la aussi à voix haute)' : 'Your line (say it out loud too)') : fr ? 'Que répondez-vous ?' : 'What do you say?'}</Text>
          {options.map((o) => (
            <Pressable
              key={o}
              accessibilityLabel={`Reply ${o}`}
              onPress={() => {
                if (o === line.text) {
                  sfx.click();
                  say(o, course.voice, 0.9);
                  setWrongPick(null);
                  setN(n + 1);
                } else {
                  sfx.wrong();
                  setWrongPick(o);
                  setMistakes((m) => m + 1);
                }
              }}
              style={[styles.option, wrongPick === o && styles.wrong]}>
              <Text style={styles.optionText}>{o}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function StoryStep({ step, course, fr, onNext }: { step: Extract<FullStep, { type: 'story' }>; course: Course; fr: boolean; onNext: () => void }) {
  const [n, setN] = useState(1);
  const [gloss, setGloss] = useState<string | null>(null);
  const [showTr, setShowTr] = useState<number | null>(null);
  const s = step.story;
  const tap = (word: string, i: number) => {
    // Letters and their combining marks (Hindi vowel signs, Arabic short vowels) make up the word.
    const key = word.toLowerCase().replace(/[^\p{L}\p{M}]/gu, '');
    const g = s.glossary[key];
    say(word, course.voice, 0.85);
    setGloss(g ? `${word} → ${fr ? g[1] : g[0]}` : null);
    setShowTr(g ? null : i);
  };
  return (
    <View style={styles.storyWrap}>
      <SceneBanner course={course} id={s.id} icon={s.icon} title={fr ? s.fr : s.en} fr={fr} />
      {s.sentences.slice(0, n).map(([text, en, frx], i) => (
        <Animated.View key={i} entering={FadeInDown.duration(240)} style={styles.storyLine}>
          <Text style={styles.storyText}>
            {text.split(/(\s+)/).map((w, k) =>
              /\s+/.test(w) ? (
                w
              ) : (
                <Text key={k} accessibilityLabel={`Word ${w}`} onPress={() => tap(w, i)} style={s.glossary[w.toLowerCase().replace(/[^\p{L}\p{M}]/gu, '')] ? [styles.glossWord, { textDecorationColor: course.color }] : undefined}>
                  {w}
                </Text>
              ),
            )}
          </Text>
          <Pressable accessibilityLabel={`Translate sentence ${i + 1}`} onPress={() => setShowTr(showTr === i ? null : i)} hitSlop={6}>
            <Text style={styles.translateLink}>{showTr === i ? (fr ? frx : en) : fr ? 'Traduire' : 'Translate'}</Text>
          </Pressable>
        </Animated.View>
      ))}
      {!!gloss && <Text style={[styles.gloss, { borderColor: course.color }]}>{gloss}</Text>}
      <View style={styles.row}>
        <Pressable accessibilityLabel="Read aloud" onPress={() => say(s.sentences[n - 1][0], course.voice, 0.85)} style={styles.secondary}>
          <Text style={styles.secondaryText}>🔊</Text>
        </Pressable>
        {n < s.sentences.length ? (
          <Pressable accessibilityLabel="Next sentence" onPress={() => setN(n + 1)} style={[styles.primary, styles.flex, { backgroundColor: course.color }]}>
            <Text style={styles.primaryText}>{fr ? 'Phrase suivante' : 'Next sentence'}</Text>
          </Pressable>
        ) : (
          <Pressable accessibilityLabel="Continue" onPress={onNext} style={[styles.primary, styles.flex, { backgroundColor: course.color }]}>
            <Text style={styles.primaryText}>{fr ? 'Aux questions' : 'To the questions'}</Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.sub}>{fr ? 'Touchez un mot souligné pour sa traduction.' : 'Tap an underlined word to translate it.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: 14, alignSelf: 'stretch' },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' },
  flex: { flex: 1 },
  kicker: { fontSize: 12, fontWeight: '900', letterSpacing: 1.5, textAlign: 'center' },
  prompt: { color: colors.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  sub: { color: colors.muted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  sentence: { color: colors.text, fontSize: 24, fontWeight: '700', textAlign: 'center', lineHeight: 34 },
  slot: { fontWeight: '900', textDecorationLine: 'underline' },
  options: { gap: 10, alignSelf: 'stretch' },
  option: { minHeight: 54, borderRadius: 16, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', padding: 12 },
  optionText: { color: colors.text, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  chip: { minHeight: 50, minWidth: 80, paddingHorizontal: 16, borderRadius: 14, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  right: { borderColor: '#2FAE77', backgroundColor: 'rgba(61,220,151,0.15)' },
  wrong: { borderColor: '#E5484D', backgroundColor: 'rgba(229,72,77,0.15)' },
  sound: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  soundBig: { width: 84, height: 84, borderRadius: 42 },
  note: { alignSelf: 'stretch', borderLeftWidth: 4, borderRadius: 16, padding: 16, gap: 12, backgroundColor: colors.surface },
  noteText: { color: colors.text, fontSize: 17, lineHeight: 25 },
  example: { gap: 2 },
  exampleText: { fontSize: 18, fontWeight: '800' },
  primary: { minHeight: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, alignSelf: 'stretch' },
  primaryText: { color: '#0B0D14', fontWeight: '900', fontSize: 16 },
  secondary: { minHeight: 50, minWidth: 56, paddingHorizontal: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  secondaryText: { color: colors.text, fontWeight: '800', fontSize: 15 },
  mic: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  micText: { fontSize: 38, color: '#0B0D14' },
  input: { alignSelf: 'stretch', minHeight: 54, borderWidth: 2, borderRadius: 14, paddingHorizontal: 16, fontSize: 20, color: colors.text, backgroundColor: colors.surface },
  dialogue: { gap: 10, alignSelf: 'stretch' },
  bubble: { maxWidth: '86%', borderRadius: 18, padding: 12, gap: 2 },
  them: { backgroundColor: colors.surface, flexShrink: 1 },
  themRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', alignSelf: 'flex-start', maxWidth: '92%' },
  who: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  me: { alignSelf: 'flex-end' },
  bubbleText: { color: colors.text, fontSize: 17, fontWeight: '700' },
  storyWrap: { gap: 12, alignSelf: 'stretch' },
  storyLine: { gap: 4 },
  storyText: { color: colors.text, fontSize: 20, lineHeight: 30 },
  glossWord: { textDecorationLine: 'underline', textDecorationStyle: 'dotted' },
  translateLink: { color: colors.muted, fontSize: 13 },
  gloss: { color: colors.text, fontSize: 16, fontWeight: '800', borderWidth: 1.5, borderRadius: 12, padding: 10, textAlign: 'center' },
});
