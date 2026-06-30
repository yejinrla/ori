import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Screen } from '../../src/components/Screen';
import type { Recipe } from '../../src/data';
import { useRecipes } from '../../src/store';
import { styles } from '../../src/styles';

export default function LinkImporterScreen() {
  const { addRecipe } = useRecipes();
  const [linkInput, setLinkInput] = useState('');

  const createRecipeFromLink = () => {
    const url = linkInput.trim();
    if (!url) {
      return;
    }

    const sourceType: Recipe['sourceType'] = url.includes('instagram')
      ? 'instagram'
      : url.includes('youtube') || url.includes('youtu.be')
        ? 'youtube'
        : 'blog';

    const titleSeed =
      sourceType === 'youtube'
        ? '유튜브 레시피'
        : sourceType === 'instagram'
          ? '인스타 레시피'
          : '블로그 레시피';

    const recipe: Recipe = {
      id: Date.now().toString(),
      title: `${titleSeed} 자동 정리`,
      category: sourceType === 'instagram' ? '간식' : '한식',
      tags: ['#AI정리', '#링크가져오기', sourceType === 'youtube' ? '#영상레시피' : '#스크랩'],
      ingredients: ['주재료 1', '주재료 2', '채소 1종'],
      seasonings: ['간장 1큰술', '설탕 1작은술', '고춧가루 1큰술'],
      steps: [
        '링크 본문에서 재료와 양념을 추출한다.',
        '중복 표현을 정리하고 계량을 통일한다.',
        '조리 순서를 보기 쉬운 단계형 레시피로 재구성한다.',
      ],
      memo: 'AI가 자동 생성한 초안입니다. 내 입맛에 맞게 수정해보세요.',
      image: sourceType === 'instagram' ? '📸' : sourceType === 'youtube' ? '🎬' : '📝',
      sourceUrl: url,
      sourceType,
      favorite: false,
      addedAt: '2026.06.30',
    };

    addRecipe(recipe);
    setLinkInput('');
    router.replace(`/recipe/${recipe.id}`);
  };

  return (
    <Screen back title="링크 가져오기">
      <View style={styles.content}>
        <Text style={styles.screenDescription}>
          링크를 붙여넣으면 AI가 본문을 분석해 제목, 재료, 양념, 순서를 정리합니다.
        </Text>
        <View style={styles.panel}>
          <Text style={styles.label}>지원 채널</Text>
          <Text style={styles.helperText}>YouTube · Instagram · 네이버 블로그 · 브런치</Text>
          <TextInput
            style={styles.input}
            placeholder="https://"
            placeholderTextColor="#8C7A70"
            value={linkInput}
            onChangeText={setLinkInput}
            autoCapitalize="none"
          />
          <Pressable style={styles.primaryButton} onPress={createRecipeFromLink}>
            <Text style={styles.primaryButtonText}>AI로 레시피 정리</Text>
          </Pressable>
        </View>
        <View style={styles.aiPreview}>
          <Text style={styles.aiPreviewTitle}>AI 정리 예시</Text>
          <Text style={styles.aiPreviewText}>제목: 백종원 제육볶음</Text>
          <Text style={styles.aiPreviewText}>재료: 돼지고기, 양파, 대파</Text>
          <Text style={styles.aiPreviewText}>양념: 고추장, 간장, 설탕, 고춧가루</Text>
          <Text style={styles.aiPreviewText}>순서: 준비 → 양념 → 볶기</Text>
        </View>
      </View>
    </Screen>
  );
}
