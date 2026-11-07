import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { friendlyError, setNewPassword } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

/** Where the password-reset email leads: choose a new password (the link has already signed you in). */
export default function ResetPasswordScreen() {
  const { account, setRecovering } = useStore();
  const t = useT();
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const save = async () => {
    setError(null);
    if (password.length < 8) return setError(t('The password needs at least 8 characters.'));
    if (password !== again) return setError(t('The two passwords are different.'));
    setBusy(true);
    try {
      await setNewPassword(password);
      setRecovering(false);
      setDone(true);
    } catch (e) {
      setError(t(friendlyError(e)));
    }
    setBusy(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('Choose a new password')}</Text>
        {done ? (
          <>
            <Text style={styles.subtitle}>{t('Your password is changed and you’re logged in.')}</Text>
            <Pressable onPress={() => router.replace('/')} style={styles.primary}>
              <Text style={styles.primaryText}>{t('Continue')}</Text>
            </Pressable>
          </>
        ) : !account ? (
          <>
            <Text style={styles.subtitle}>{t('Checking your reset link… If nothing happens, the link may have expired: ask for a new one.')}</Text>
            <Pressable onPress={() => router.replace({ pathname: '/auth', params: { mode: 'forgot' } })} style={styles.secondary}>
              <Text style={styles.secondaryText}>{t('Send a new link')}</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>{t('For {email}', { email: account.email })}</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder={t('New password (at least 8 characters)')} placeholderTextColor={colors.muted} autoComplete="new-password" style={styles.input} />
            <TextInput value={again} onChangeText={setAgain} secureTextEntry placeholder={t('New password again')} placeholderTextColor={colors.muted} autoComplete="new-password" onSubmitEditing={save} style={styles.input} />
            {error && <Text style={styles.error}>{error}</Text>}
            <Pressable accessibilityLabel="Save new password" disabled={busy} onPress={save} style={styles.primary}>
              {busy ? <ActivityIndicator color={colors.onAccent} /> : <Text style={styles.primaryText}>{t('Save new password')}</Text>}
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, gap: 12, maxWidth: 480, width: '100%', alignSelf: 'center', flex: 1, justifyContent: 'center' },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 36 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 21 },
  input: { borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text, fontSize: 16, paddingHorizontal: 16, paddingVertical: 14 },
  error: { color: '#E5484D', fontWeight: '700' },
  primary: { marginTop: 6, paddingVertical: 16, borderRadius: 999, alignItems: 'center', backgroundColor: colors.accent },
  primaryText: { color: colors.onAccent, fontWeight: '800', fontSize: 16 },
  secondary: { paddingVertical: 14, borderRadius: 999, alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  secondaryText: { color: colors.text, fontWeight: '800' },
});
