import { View } from 'react-native';

import { styles } from '../styles';

export function OptionIcon({
  variant,
  tone,
}: {
  variant: 'link' | 'note';
  tone: 'dark' | 'light';
}) {
  const isDark = tone === 'dark';
  const stroke = isDark ? '#FFFFFF' : '#6F5549';
  const background = isDark ? 'rgba(255,255,255,0.06)' : '#F4E6D8';

  return (
    <View style={[styles.optionIconFrame, { backgroundColor: background, borderColor: stroke }]}>
      {variant === 'link' ? (
        <View style={styles.optionLinkIcon}>
          <View style={[styles.optionLinkLoop, { borderColor: stroke }]} />
          <View style={[styles.optionLinkBridge, { backgroundColor: stroke }]} />
          <View style={[styles.optionLinkLoop, { borderColor: stroke, marginLeft: -6 }]} />
        </View>
      ) : (
        <View style={styles.optionNoteIcon}>
          <View style={[styles.optionNoteSheet, { borderColor: stroke }]}>
            <View style={[styles.optionNoteLine, { backgroundColor: stroke }]} />
            <View style={[styles.optionNoteLineShort, { backgroundColor: stroke }]} />
          </View>
          <View style={[styles.optionPenBody, { backgroundColor: stroke }]} />
        </View>
      )}
    </View>
  );
}
