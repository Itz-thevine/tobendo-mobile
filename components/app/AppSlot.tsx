import { useLocalUser } from '@/context/local-user/useLocalUser';
import { useInitializeLocalUser } from '@/hooks/useInitializeLocalUser';
import { Redirect, Stack, useRootNavigationState } from 'expo-router';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

const AppSlot = () => {
    const rootNavigationState = useRootNavigationState();
    useInitializeLocalUser();
    const localUserId = useLocalUser()?.data?.user_id;
    const [redirectNode, setRedirectNode] = useState<React.ReactNode | undefined>(undefined);

    useEffect(() => {
        if(rootNavigationState.key){
            if(localUserId && redirectNode){
                setRedirectNode(undefined);
            }
            else if(!localUserId && !redirectNode){
                setRedirectNode(<>
                    <Redirect href={'/(auth)/signin'} />
                </>);
            }
        }
    }, [rootNavigationState.key, localUserId]);

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