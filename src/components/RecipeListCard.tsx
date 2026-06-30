import { Pressable, Text, View } from 'react-native';

import type { Recipe } from '../data';
import { styles } from '../styles';
import { TagRow } from './TagRow';

export function RecipeListCard({
  recipe,
  onPress,
  onFavorite,
}: {
  recipe: Recipe;
  onPress: () => void;
  onFavorite: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.listCard}>
      <View style={styles.listCardHeader}>
        <Text style={styles.listCardEmoji}>{recipe.image}</Text>
        <View style={styles.listCardTextBlock}>
          <Text style={styles.listCardTitle}>{recipe.title}</Text>
          <Text style={styles.listCardMeta}>
            {recipe.category} · {recipe.addedAt}
          </Text>
        </View>
        <Pressable hitSlop={8} onPress={onFavorite}>
          <Text style={styles.favoriteToggle}>{recipe.favorite ? '★' : '☆'}</Text>
        </Pressable>
      </View>
      <Text style={styles.cardSnippet} numberOfLines={2}>
        {recipe.ingredients.join(' · ')}
      </Text>
      <TagRow tags={recipe.tags} />
    </Pressable>
  );
}
