import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RecipeProvider } from '../src/store';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    MaruBuri: require('../assets/MaruBuri-Regular.ttf'),
    MaruBuriSemiBold: require('../assets/MaruBuri-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <RecipeProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FFFFFF' },
            animation: 'fade',
          }}
        />
      </RecipeProvider>
    </SafeAreaProvider>
  );
}
