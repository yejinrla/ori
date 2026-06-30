import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { styles } from '../styles';

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}
