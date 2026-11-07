import { Pressable, StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors } from '@/lib/theme';

/** The app's search box: a magnifier on the left, a clear button once you've typed. */
export function SearchField({ containerStyle, value, onChangeText, ...rest }: TextInputProps & { containerStyle?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.box, containerStyle]}>
      <Icon name="search" size={18} color={colors.muted} strokeWidth={2.2} />
      <TextInput value={value} onChangeText={onChangeText} placeholderTextColor={colors.muted} style={styles.input} {...rest} />
      {!!value && (
        <Pressable accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={10} onPress={() => onChangeText?.('')} style={styles.clear}>
          <Icon name="close" size={11} color={colors.background} strokeWidth={3} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, borderRadius: 14, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  input: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: 12, outlineStyle: 'none' } as object,
  clear: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.muted },
});
