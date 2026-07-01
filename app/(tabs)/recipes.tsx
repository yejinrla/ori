import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { RecipeListCard } from '../../src/components/RecipeListCard';
import { Screen } from '../../src/components/Screen';
import { SearchIcon } from '../../src/components/SearchIcon';
import { useRecipes } from '../../src/store';
import { styles } from '../../src/styles';

export default function RecipesScreen() {
  const { recipes, toggleFavorite } = useRecipes();
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categoryOptions = ['전체', '한식', '일식', '중식', '양식', '간식', '디저트', '술안주'];
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleRecipes = recipes.filter((recipe) => {
    if (favoriteOnly && !recipe.favorite) {
      return false;
    }

    if (categoryFilter === '전체') {
      if (!normalizedQuery) {
        return true;
      }
    } else if (recipe.category !== categoryFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchable = [
      recipe.title,
      recipe.category,
      ...recipe.ingredients,
      ...recipe.seasonings,
      ...recipe.tags,
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });

  return (
    <Screen title="내 레시피">
      <View style={styles.recipesScreen}>
        <View style={styles.recipesHeader}>
          <Text style={styles.recipesCount}>{visibleRecipes.length}개의 레시피</Text>
        </View>
        <View style={styles.recipeFilterSection}>
          <View style={styles.recipeFilterBar}>
            <Pressable
              onPress={() => setFavoriteOnly((current) => !current)}
              style={[styles.recipeFilterChip, favoriteOnly && styles.recipeFilterChipActive]}
            >
              <Text style={[styles.recipeFilterText, favoriteOnly && styles.recipeFilterTextActive]}>
                즐겨찾기
              </Text>
            </Pressable>
            <View style={styles.recipeComboWrap}>
              <Pressable
                onPress={() => setCategoryMenuOpen((current) => !current)}
                style={[
                  styles.recipeComboButton,
                  categoryMenuOpen && styles.recipeComboButtonActive,
                  categoryFilter !== '전체' && styles.recipeComboButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.recipeComboText,
                    categoryFilter !== '전체' && styles.recipeComboTextSelected,
                  ]}
                >
                  {categoryFilter === '전체' ? '카테고리' : categoryFilter}
                </Text>
                <Text style={styles.recipeComboChevron}>{categoryMenuOpen ? '▴' : '▾'}</Text>
              </Pressable>
              {categoryMenuOpen ? (
                <View style={styles.recipeComboMenu}>
                  {categoryOptions.map((category) => {
                    const selected = category === categoryFilter;
                    return (
                      <Pressable
                        key={category}
                        onPress={() => {
                          setCategoryFilter(category);
                          setCategoryMenuOpen(false);
                        }}
                        style={[
                          styles.recipeComboOption,
                          selected && styles.recipeComboOptionSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.recipeComboOptionText,
                            selected && styles.recipeComboOptionTextSelected,
                          ]}
                        >
                          {category}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </View>
            <View style={styles.recipeMiniSearch}>
              <SearchIcon />
              <TextInput
                style={styles.recipeMiniSearchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="검색"
                placeholderTextColor="#9A8C80"
              />
              {searchQuery.length > 0 ? (
                <Pressable hitSlop={8} onPress={() => setSearchQuery('')}>
                  <Text style={styles.recipeMiniSearchClear}>✕</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
        <ScrollView
          style={styles.recipesListScroll}
          contentContainerStyle={styles.recipesList}
          showsVerticalScrollIndicator={false}
        >
          {visibleRecipes.length === 0 ? (
            <Text style={styles.searchHint}>
              {favoriteOnly
                ? '조건에 맞는 즐겨찾기 레시피가 없어요.'
                : '아직 저장한 레시피가 없어요.'}
            </Text>
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
