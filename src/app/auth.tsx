import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { accountsEnabled, friendlyError, sendReset, signIn, signUp } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { IMPORT_KEY, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

type Mode = 'login' | 'signup' | 'forgot';
const emailOk = (e: string) => /^\S+@\S+\.\S+$/.test(e.trim());

/** Log in, create an account, or ask for a password-reset email. Also lets people carry on without an account. */
export default function AuthScreen() {
  const params = useLocalSearchParams<{ mode?: Mode }>();
  const [mode, setMode] = useState<Mode>(params.mode === 'signup' || params.mode === 'forgot' ? params.mode : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [bring, setBring] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { continueAsGuest, account, ready } = useStore();
  const t = useT();
  // Once the new account (or the one just logged in to) has loaded, go into the app.
  const startedAs = useRef(account?.id ?? null);
  useEffect(() => {
    if (ready && account && account.id !== startedAs.current) router.replace('/');
  }, [account, ready]);

  const go = (m: Mode) => {
    setMode(m);
    setError(null);
    setNotice(null);
  };
  const submit = async () => {
    setError(null);
    setNotice(null);
    if (!emailOk(email)) return setError(t('Enter a valid email address.'));
    if (mode !== 'forgot' && password.length < 8) return setError(t('The password needs at least 8 characters.'));
    setBusy(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else if (mode === 'signup') {
        if (bring) await AsyncStorage.setItem(IMPORT_KEY, email.trim());
        else await AsyncStorage.removeItem(IMPORT_KEY);
        const signedIn = await signUp(email, password, name);
        if (!signedIn) {
          setNotice(t('Almost done: we sent a link to {email}. Open it to confirm your account, then log in.', { email: email.trim() }));
          setMode('login');
        }
      } else {
        await sendReset(email);
        setNotice(t('If an account exists for {email}, a reset link is on its way. Open it on this device.', { email: email.trim() }));
      }
    } catch (e) {
      setError(t(friendlyError(e)));
    }
    setBusy(false);
  };

  if (!accountsEnabled) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('Accounts are coming soon')}</Text>
          <Text style={styles.subtitle}>{t('This version of the app has no account server yet, so everything stays on this device.')}</Text>
          <Pressable onPress={() => router.replace('/')} style={styles.primary}>
            <Text style={styles.primaryText}>{t('Continue')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>DeepStach</Text>
          <Text style={styles.title}>{t(mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset your password')}</Text>
          <Text style={styles.subtitle}>
            {t(
              mode === 'login'
                ? 'Log in to find your own books, cards, settings and progress.'
                : mode === 'signup'
                  ? 'Your own private space: settings, stashes, reading and brain progress, saved online and on every device you log in to.'
                  : 'Type your account’s email and we’ll send you a link to choose a new password.',
            )}
          </Text>

          {mode === 'signup' && (
            <TextInput value={name} onChangeText={setName} placeholder={t('First name (optional)')} placeholderTextColor={colors.muted} autoComplete="given-name" style={styles.input} />
          )}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('Email')}
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            inputMode="email"
            style={styles.input}
          />
          {mode !== 'forgot' && (
            <View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={t(mode === 'signup' ? 'Password (at least 8 characters)' : 'Password')}
                placeholderTextColor={colors.muted}
                secureTextEntry={!show}
                autoCapitalize="none"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                onSubmitEditing={submit}
                style={[styles.input, styles.withEye]}
              />
              <Pressable accessibilityLabel={show ? 'Hide password' : 'Show password'} onPress={() => setShow(!show)} hitSlop={8} style={styles.eye}>
                <Text style={styles.eyeText}>{show ? t('Hide') : t('Show')}</Text>
              </Pressable>
            </View>
          )}
          {mode === 'signup' && (
            <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: bring }} onPress={() => setBring(!bring)} style={styles.check}>
              <View style={[styles.box, bring && styles.boxOn]}>{bring && <Text style={styles.tick}>✓</Text>}</View>
              <Text style={styles.checkText}>{t('Bring what I already did on this device into my account')}</Text>
            </Pressable>
          )}
          {mode === 'login' && (
            <Pressable onPress={() => go('forgot')} hitSlop={6} style={styles.forgot}>
              <Text style={styles.link}>{t('Forgot password?')}</Text>
            </Pressable>
          )}

          {error && <Text style={styles.error}>{error}</Text>}
          {notice && <Text style={styles.notice}>{notice}</Text>}

          <Pressable accessibilityLabel={mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send reset link'} disabled={busy} onPress={submit} style={[styles.primary, busy && styles.dim]}>
            {busy ? <ActivityIndicator color={colors.onAccent} /> : <Text style={styles.primaryText}>{t(mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send reset link')}</Text>}
          </Pressable>

          <View style={styles.switchRow}>
            {mode === 'login' ? (
              <>
                <Text style={styles.muted}>{t('New here?')}</Text>
                <Pressable onPress={() => go('signup')} hitSlop={6}>
                  <Text style={styles.link}>{t('Create an account')}</Text>
                </Pressable>
              </>
            ) : (
              <Pressable onPress={() => go('login')} hitSlop={6}>
                <Text style={styles.link}>{t('Back to log in')}</Text>
              </Pressable>
            )}
          </View>

          {!account && (
            <Pressable
              accessibilityLabel="Continue without an account"
              onPress={() => {
                continueAsGuest();
                router.replace('/');
              }}
              style={styles.guest}>
              <Text style={styles.guestText}>{t('Continue without an account')}</Text>
              <Text style={styles.mutedSmall}>{t('Everything stays on this device only.')}</Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: 24, gap: 12, maxWidth: 480, width: '100%', alignSelf: 'center', flexGrow: 1, justifyContent: 'center' },
  logo: { color: colors.accent, fontSize: 14, fontWeight: '900', letterSpacing: 3, textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 21, marginBottom: 8 },
  input: { borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text, fontSize: 16, paddingHorizontal: 16, paddingVertical: 14 },
  withEye: { paddingRight: 70 },
  eye: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  eyeText: { color: colors.accent, fontWeight: '800' },
  check: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  tick: { color: colors.onAccent, fontWeight: '900', fontSize: 13 },
  checkText: { color: colors.text, flex: 1, lineHeight: 20 },
  forgot: { alignSelf: 'flex-end' },
  link: { color: colors.accent, fontWeight: '800' },
  error: { color: '#E5484D', fontWeight: '700', lineHeight: 20 },
  notice: { color: colors.text, backgroundColor: colors.surface, borderRadius: 12, padding: 12, lineHeight: 20, overflow: 'hidden' },
  primary: { marginTop: 6, paddingVertical: 16, borderRadius: 999, alignItems: 'center', backgroundColor: colors.accent },
  primaryText: { color: colors.onAccent, fontWeight: '800', fontSize: 16 },
  dim: { opacity: 0.6 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 4 },
  muted: { color: colors.muted },
  mutedSmall: { color: colors.muted, fontSize: 12 },
  guest: { alignItems: 'center', marginTop: 18, gap: 2, paddingVertical: 8 },
  guestText: { color: colors.text, fontWeight: '700', textDecorationLine: 'underline' },
});
