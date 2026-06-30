import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';

import { styles } from '../styles';

const tabItems = [
  { name: 'index', icon: '⌂', label: '홈' },
  { name: 'recipes', icon: '▤', label: '레시피' },
  { name: 'calendar', icon: '▦', label: '캘린더' },
  { name: 'mypage', icon: '◍', label: '마이페이지' },
] as const;

function NavItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.navItem}>
      <Text style={[styles.navIcon, active && styles.navIconActive]}>{icon}</Text>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const activeName = state.routes[state.index]?.name;

  const renderTab = (item: (typeof tabItems)[number]) => (
    <NavItem
      key={item.name}
      icon={item.icon}
      label={item.label}
      active={activeName === item.name}
      onPress={() => navigation.navigate(item.name)}
    />
  );

  return (
    <View style={styles.bottomNav}>
      {renderTab(tabItems[0])}
      {renderTab(tabItems[1])}
      <Pressable style={styles.navCenter} onPress={() => router.push('/add')}>
        <View style={styles.navAddButton}>
          <Text style={styles.navAddIcon}>+</Text>
        </View>
      </Pressable>
      {renderTab(tabItems[2])}
      {renderTab(tabItems[3])}
    </View>
  );
}
