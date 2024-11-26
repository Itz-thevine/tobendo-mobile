import { useInitializeLocalUser } from '@/hooks/useInitializeLocalUser';
import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';

const AppSlot = () => {
    useInitializeLocalUser();
    // console.log(useLocalUser()?.data?.isSeller)

    return (
        <Stack initialRouteName='(onboard)'>
            <Stack.Screen name="(onboard)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(innerApp)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(seller)" options={{ headerShown: false }} />
            <Stack.Screen name="(customer)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}

export default AppSlot;