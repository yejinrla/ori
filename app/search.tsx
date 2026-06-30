import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { RecipeListCard } from '../src/components/RecipeListCard';
import { Screen } from '../src/components/Screen';
import { SearchIcon } from '../src/components/SearchIcon';
import { useRecipes } from '../src/store';
import { styles } from '../src/styles';

export default function SearchScreen() {
  const { recipes, toggleFavorite } = useRecipes();
  const [query, setQuery] = useState('');

  const filteredRecipes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return recipes;
    }
    return recipes.filter((recipe) => {
      const corpus = [
        recipe.title,
        recipe.category,
        recipe.tags.join(' '),
        recipe.ingredients.join(' '),
        recipe.seasonings.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return corpus.includes(normalized);
    });
  }, [query, recipes]);

  const trimmed = query.trim();

  return (
    <Screen back title="검색">
      <View style={styles.searchScreen}>
        <View style={styles.homeSearchWrap}>
          <SearchIcon />
          <TextInput
            autoFocus
            placeholder="재료나 음식 검색"
            placeholderTextColor="#AFACA6"
            style={styles.homeSearchInput}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable hitSlop={8} onPress={() => setQuery('')}>
              <Text style={styles.searchClear}>✕</Text>
            </Pressable>
          ) : null}
        </View>
        <ScrollView contentContainerStyle={styles.searchResults} keyboardShouldPersistTaps="handled">
          {trimmed.length === 0 ? (
            <Text style={styles.searchHint}>레시피 이름, 재료, 태그로 검색해보세요.</Text>
          ) : filteredRecipes.length === 0 ? (
            <Text style={styles.searchHint}>‘{trimmed}’에 대한 결과가 없어요.</Text>
          ) : (
            <>
              <Text style={styles.searchCount}>{filteredRecipes.length}개의 레시피</Text>
              {filteredRecipes.map((recipe) => (
                <RecipeListCard
                  key={recipe.id}
                  recipe={recipe}
                  onPress={() => router.push(`/recipe/${recipe.id}`)}
                  onFavorite={() => toggleFavorite(recipe.id)}
                />
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}
