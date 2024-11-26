import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Text } from 'react-native';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReactQueryProviders from '@/lib/react-query/provider';
import { LocalUserProvider } from '@/context/local-user/LocalUserProvider';
import AppSlot from '@/components/app/AppSlot';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout: React.FC = () => {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      onLayoutRootView();
    }
  }, [loaded, onLayoutRootView]);
  
  if (!loaded) {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/images/mainLogo.png')} style={styles.icon} resizeMode="contain" />
        <View style={{display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 4}}>
          <ActivityIndicator size="small" color="#000" />
          <Text>Loading</Text>
        </View>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ReactQueryProviders>
        <GestureHandlerRootView>
          <LocalUserProvider>
            <AppSlot />
          </LocalUserProvider>
        </GestureHandlerRootView>
      </ReactQueryProviders>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  icon: {
    width: 150, // Adjust the width to fit the image properly
    height: undefined, // Let the height adjust automatically
    aspectRatio: 1, // Preserve the aspect ratio based on the image's dimensions
    marginBottom: 20,
  },
});

export default RootLayout;
