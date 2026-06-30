import { View } from 'react-native';

import { styles } from '../styles';

export function SearchIcon() {
  return (
    <View style={styles.searchIcon}>
      <View style={styles.searchIconGlass} />
      <View style={styles.searchIconHandle} />
    </View>
  );
}
