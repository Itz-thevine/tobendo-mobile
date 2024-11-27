import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalUser } from '@/context/local-user/useLocalUser';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout: React.FC = () => {
  const localUser = useLocalUser();
  const colorScheme = useColorScheme();
  
  useEffect(() => {
    if(!localUser?.data) router.push('/(auth)/signin');
    else if(!localUser.data.isSeller) router.push('/(seller)/onboarding-seller');
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="explore/index" options={{ headerShown: false }} />
        <Stack.Screen name="profile/index" options={{ headerShown: false }} />
        <Stack.Screen name="orders/index" options={{ headerShown: false }} />
        {/* <Stack.Screen name="product-details/index" options={{ headerShown: false }} /> */}
        <Stack.Screen name="cart/index" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}


export default RootLayout;
