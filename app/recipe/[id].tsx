import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Screen } from '../../src/components/Screen';
import { TagRow } from '../../src/components/TagRow';
import { splitIngredientText } from '../../src/data';
import { useRecipes } from '../../src/store';
import { styles } from '../../src/styles';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRecipe, toggleFavorite } = useRecipes();
  const recipe = getRecipe(id);

  if (!recipe) {
    return (
      <Screen back>
        <View style={styles.content}>
          <Text style={styles.screenTitle}>레시피를 찾을 수 없습니다.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen back>
      <ScrollView contentContainerStyle={styles.detailContent}>
        <Text style={styles.detailTitleTop}>{recipe.title}</Text>

        <View style={styles.detailPhoto}>
          <Text style={styles.detailPhotoEmoji}>{recipe.image}</Text>
        </View>

        <View style={styles.detailMetaList}>
          {recipe.cookTime ? (
            <Text style={styles.detailMetaLine}>
              <Text style={styles.detailMetaLabel}>조리 시간: </Text>
              {recipe.cookTime}
            </Text>
          ) : null}
          <Text style={styles.detailMetaLine}>
            <Text style={styles.detailMetaLabel}>분류: </Text>
            {recipe.category}
          </Text>
          {typeof recipe.rating === 'number' ? (
            <Text style={styles.detailMetaLine}>
              <Text style={styles.detailMetaLabel}>평점: </Text>
              {`★ ${recipe.rating.toFixed(1)}`}
            </Text>
          ) : null}
          <Text style={styles.detailMetaLine}>
            <Text style={styles.detailMetaLabel}>저장일: </Text>
            {recipe.addedAt}
          </Text>
        </View>

        {recipe.tags.length ? <TagRow tags={recipe.tags} /> : null}

        <Text style={styles.detailSectionHeading}>재료</Text>
        <View style={styles.ingredientGrid}>
          {recipe.ingredients.map((item, index) => {
            const parsed = splitIngredientText(item);
            return (
              <View key={`ing-${index}`} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>{parsed.name}</Text>
                <Text style={styles.ingredientAmount}>{parsed.amount}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.detailSectionHeading}>양념</Text>
        <View style={styles.ingredientGrid}>
          {recipe.seasonings.map((item, index) => {
            const parsed = splitIngredientText(item);
            return (
              <View key={`sea-${index}`} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>{parsed.name}</Text>
                <Text style={styles.ingredientAmount}>{parsed.amount}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.detailSectionHeading}>조리 순서</Text>
        <View style={styles.detailSteps}>
          {recipe.steps.map((item, index) => (
            <Text key={`step-${index}`} style={styles.detailStepText}>
              <Text style={styles.detailStepNumber}>{`${index + 1}. `}</Text>
              {item}
            </Text>
          ))}
        </View>

        <Text style={styles.detailSectionHeading}>메모</Text>
        <Text style={styles.detailText}>{recipe.memo || '메모 없음'}</Text>

        {recipe.sourceUrl ? (
          <>
            <Text style={styles.detailSectionHeading}>원본 링크</Text>
            <Text style={styles.detailText}>{recipe.sourceUrl}</Text>
          </>
        ) : null}

        <Pressable style={styles.detailFavoriteButton} onPress={() => toggleFavorite(recipe.id)}>
          <Text style={styles.detailFavoriteText}>
            {recipe.favorite ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기 추가'}
          </Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
