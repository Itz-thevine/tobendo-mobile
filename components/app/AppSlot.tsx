import { useLocalUser } from '@/context/local-user/useLocalUser';
import { useInitializeLocalUser } from '@/hooks/useInitializeLocalUser';
import { Redirect, Stack, useRootNavigationState } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';

const AppSlot = () => {
    const rootNavigationState = useRootNavigationState();
    useInitializeLocalUser();
    const localUser = useLocalUser();
    
    let redirectNode = <></>
    if(rootNavigationState?.key && !localUser?.data?.user_id){
        redirectNode = <>
            <Redirect href={'/(auth)/signin'} />
        </>;
    };

    // useEffect(() => {
    //   if(!localUser?.data) router.push('/(auth)/signin');
    //   else if(!localUser.data.isSeller) router.push('/(seller)/onboarding-seller');
    // }, []);
    // console.log(useLocalUser()?.data?.isSeller)

    return (
        <>
            {redirectNode}
            <Stack initialRouteName='(onboard)'>
                <Stack.Screen name="(onboard)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(innerApp)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(seller)" options={{ headerShown: false }} />
                <Stack.Screen name="(customer)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
        </>
    );
}

export default AppSlot;