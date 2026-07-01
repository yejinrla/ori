import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { FeaturedCard } from '../../src/components/FeaturedCard';
import { Screen } from '../../src/components/Screen';
import { SearchIcon } from '../../src/components/SearchIcon';
import { useRecipes } from '../../src/store';
import { styles } from '../../src/styles';

export default function HomeScreen() {
  const { recipes } = useRecipes();
  const recentRecipes = [...recipes].slice(0, 3);
  const recommendedRecipes = [...recipes].reverse();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.homeContent}>
        <View style={styles.homeIntro}>
          <Text style={styles.homeIntroEyebrow}>👋 안녕하세요!</Text>
          <Text style={styles.homeIntroTitle}>6월 30일 화요일,</Text>
          <Text style={styles.homeIntroSubtitle}>오늘은 무엇을 만들어볼까요?</Text>
        </View>

        <Pressable style={styles.homeSearchWrap} onPress={() => router.push('/search')}>
          <SearchIcon />
          <Text style={styles.homeSearchPlaceholder}>재료나 음식 검색</Text>
        </Pressable>

        <Text style={styles.homeRailTitle}>최근 저장한 레시피</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredRail}
        >
          {recentRecipes.map((recipe) => (
            <FeaturedCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
            />
          ))}
        </ScrollView>

        <Text style={[styles.homeRailTitle, styles.homeRailTitleSpaced]}>오늘의 추천</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredRail}
        >
          {recommendedRecipes.map((recipe) => (
            <FeaturedCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </Screen>
  );
}
