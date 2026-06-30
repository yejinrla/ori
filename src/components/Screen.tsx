import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from './TopBar';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <TopBar back={back} title={title} />
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
