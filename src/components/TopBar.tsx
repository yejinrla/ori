import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { styles } from '../styles';

export function TopBar({ back = false, title = '오늘의 요리' }: { back?: boolean; title?: string }) {
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={styles.topBar}>
      {back ? (
        <Pressable onPress={goBack} style={styles.topBarBackWrap} hitSlop={8}>
          <Text style={styles.topBarBack}>‹</Text>
        </Pressable>
      ) : null}
      <Text style={styles.topBarTitle}>{title}</Text>
    </View>
  );
}
