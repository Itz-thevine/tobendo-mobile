import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/auth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout: React.FC = () => {
  const colorScheme = useColorScheme();
  const authHook = useAuth();
  
  useEffect(() => {
    if(!authHook.user) router.push('/(auth)/signin');
    else if(!authHook.isSeller) router.push('/(seller)/onboarding-seller');
  }, []);
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="seller" options={{ headerShown: false }} />
        <Stack.Screen name="add-new-inventory/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding-seller/index" options={{ headerShown: false }} />
        <Stack.Screen name="withdraw-earnings/index" options={{ headerShown: false }} />
        <Stack.Screen name="company-details/index" options={{ headerShown: false }} />
        <Stack.Screen name="bank-details/index" options={{ headerShown: false }} />
        <Stack.Screen name="profile/index" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}


export default RootLayout;
