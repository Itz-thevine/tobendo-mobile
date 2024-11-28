import { useLocalUser } from "@/context/local-user/useLocalUser";
import { useEffect, useState } from "react";
import { Redirect, useRootNavigationState } from "expo-router";

export const useInitializeLocalUser = () => {
    const localUser = useLocalUser();

    const rootNavigationState = useRootNavigationState();
    const localUserId = localUser?.data?.user_id;
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

    return {
      redirectNode,
    };
};