import { Pressable, Text, View } from 'react-native';

import type { Recipe } from '../data';
import { styles } from '../styles';

export function FeaturedCard({
  recipe,
  emoji,
  onPress,
}: {
  recipe: Recipe;
  emoji: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.featuredCard} onPress={onPress}>
      <View style={styles.featuredBody}>
        <Text style={styles.featuredTitle} numberOfLines={2}>
          {recipe.title.replace(/ /g, '\n')}
        </Text>
        <Text style={styles.featuredMeta}>{recipe.category}</Text>
        <View style={styles.featuredInfoRow}>
          {recipe.cookTime ? (
            <View style={styles.featuredInfoItem}>
              <Text style={styles.featuredTimeIcon}>{'⏱︎'}</Text>
              <Text style={styles.featuredInfo}>{recipe.cookTime}</Text>
            </View>
          ) : null}
          {typeof recipe.rating === 'number' ? (
            <View style={styles.featuredInfoItem}>
              <Text style={styles.featuredStarIcon}>★</Text>
              <Text style={styles.featuredInfo}>{recipe.rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.featuredImageArea}>
        <Text style={styles.featuredEmoji}>{emoji}</Text>
      </View>
    </Pressable>
  );
}
