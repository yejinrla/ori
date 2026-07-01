import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from './TopBar';
import { styles } from '../styles';

export function Screen({
  children,
  back = false,
  title,
}: {
  children: ReactNode;
  back?: boolean;
  title?: string;
}) {
  return (
    <View style={styles.screenViewport}>
      <SafeAreaView style={styles.screenFrame} edges={['top']}>
        <TopBar back={back} title={title} />
        <View style={styles.screenBody}>{children}</View>
      </SafeAreaView>
    </View>
  );
}
