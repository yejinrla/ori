import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { OptionIcon } from '../../src/components/OptionIcon';
import { Screen } from '../../src/components/Screen';
import { styles } from '../../src/styles';

export default function AddScreen() {
  return (
    <Screen back title="레시피 추가">
      <View style={styles.content}>
        <Text style={styles.screenDescription}>
          인터넷 링크를 가져오거나 직접 작성해서 나만의 레시피북에 저장하세요.
        </Text>
        <Pressable disabled style={[styles.primaryOption, styles.primaryOptionDisabled]}>
          <OptionIcon variant="link" tone="dark" />
          <View style={styles.optionTextBlock}>
            <View style={styles.optionTitleRow}>
              <Text style={styles.optionTitleOnDark}>링크 가져오기</Text>
              <View style={styles.optionSoonBadge}>
                <Text style={styles.optionSoonBadgeText}>준비중</Text>
              </View>
            </View>
            <Text style={styles.optionDescriptionOnDark}>
              YouTube, Instagram, 블로그 링크를 AI가 레시피로 정리
            </Text>
          </View>
        </Pressable>
        <Pressable style={styles.secondaryOption} onPress={() => router.push('/add/manual')}>
          <OptionIcon variant="note" tone="light" />
          <View style={styles.optionTextBlock}>
            <Text style={styles.optionTitle}>직접 작성</Text>
            <Text style={styles.optionDescription}>재료, 양념, 조리 순서, 메모를 직접 입력해 저장</Text>
          </View>
        </Pressable>
      </View>
    </Screen>
  );
}
