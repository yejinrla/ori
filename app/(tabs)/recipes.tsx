import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { RecipeListCard } from '../../src/components/RecipeListCard';
import { Screen } from '../../src/components/Screen';
import { useRecipes } from '../../src/store';
import { styles } from '../../src/styles';

export default function RecipesScreen() {
  const { recipes, toggleFavorite } = useRecipes();
  const [recipeFilter, setRecipeFilter] = useState('전체');

  const categories = ['전체', ...Array.from(new Set(recipes.map((recipe) => recipe.category)))];
  const visibleRecipes =
    recipeFilter === '전체'
      ? recipes
      : recipes.filter((recipe) => recipe.category === recipeFilter);

  return (
    <Screen title="내 레시피">
      <View style={styles.recipesScreen}>
        <View style={styles.recipesHeader}>
          <Text style={styles.recipesCount}>{visibleRecipes.length}개의 레시피</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.recipeFilterScroll}
          contentContainerStyle={styles.recipeFilterRow}
        >
          {categories.map((category) => {
            const active = category === recipeFilter;
            return (
              <Pressable
                key={category}
                onPress={() => setRecipeFilter(category)}
                style={[styles.recipeFilterChip, active && styles.recipeFilterChipActive]}
              >
                <Text
                  style={[styles.recipeFilterText, active && styles.recipeFilterTextActive]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <ScrollView
          style={styles.recipesListScroll}
          contentContainerStyle={styles.recipesList}
          showsVerticalScrollIndicator={false}
        >
          {visibleRecipes.length === 0 ? (
            <Text style={styles.searchHint}>아직 저장한 레시피가 없어요.</Text>
          ) : (
            visibleRecipes.map((recipe) => (
              <RecipeListCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
                onFavorite={() => toggleFavorite(recipe.id)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}
