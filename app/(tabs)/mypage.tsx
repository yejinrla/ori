import { ScrollView, Text, View } from 'react-native';

import { Screen } from '../../src/components/Screen';
import { useRecipes } from '../../src/store';
import { styles } from '../../src/styles';

const menuItems = ['저장한 레시피', '즐겨찾기', '요리 기록', '알림 설정', '앱 정보'];

export default function MyPageScreen() {
  const { recipes } = useRecipes();
  const favoriteCount = recipes.filter((recipe) => recipe.favorite).length;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.mypageContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mypageProfile}>
          <View style={styles.mypageAvatar}>
            <Text style={styles.mypageAvatarText}>🧑‍🍳</Text>
          </View>
          <View>
            <Text style={styles.mypageName}>나의 요리 노트</Text>
            <Text style={styles.mypageEmail}>yejinkim@inticube.com</Text>
          </View>
        </View>

        <View style={styles.mypageStatsRow}>
          <View style={styles.mypageStat}>
            <Text style={styles.mypageStatvalue}>{recipes.length}</Text>
            <Text style={styles.mypageStatLabel}>저장한 레시피</Text>
          </View>
          <View style={styles.mypageStat}>
            <Text style={styles.mypageStatvalue}>{favoriteCount}</Text>
            <Text style={styles.mypageStatLabel}>즐겨찾기</Text>
          </View>
        </View>

        <View style={styles.mypageMenu}>
          {menuItems.map((item) => (
            <View key={item} style={styles.mypageMenuItem}>
              <Text style={styles.mypageMenuText}>{item}</Text>
              <Text style={styles.mypageMenuChevron}>›</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
