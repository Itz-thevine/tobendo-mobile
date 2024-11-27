import { useLocalUser } from "@/context/local-user/useLocalUser";
import { useGetUserApi } from "./api/user/getUser";
import { useGetCompanyDetailsApi } from "./api/user/getCompanyDetails";
import { useEffect, useState } from "react";
import { Redirect, useRootNavigationState } from "expo-router";

type useInitializeLocalUserProps = {
    onAuthed?: (authed: boolean) => void;
  }
export const useInitializeLocalUser = (props?: useInitializeLocalUserProps) => {
    const localUser = useLocalUser();
  
    const getUserApi = useGetUserApi();
    const getUserResp = getUserApi.response;
  
    const getCompanyApi = useGetCompanyDetailsApi();
    const getCompanyResp = getCompanyApi.response;

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
    
    useEffect(() => {
      if(localUser?.data?.access_token){
        if(!localUser.data.user_id) getUserApi.trigger();
        if(localUser.data.isSeller === undefined) getCompanyApi.trigger();
      }
      else {
        if(props?.onAuthed) props?.onAuthed(false);
      }
    }, [localUser?.data?.access_token]);
    useEffect(() => {
      if(getUserResp.loading === false){
        let authed = false;
        if(getUserResp.success){
          localUser?.update({
            user_id: getUserResp.data?.user_id,
            email: getUserResp.data?.email,
          });
          authed = true;
        }
        if(props?.onAuthed) props?.onAuthed(authed);
      }
    }, [getUserResp.loading]);
    useEffect(() => {
      if(getCompanyResp.loading === false){
        if(getCompanyResp.success){
          localUser?.update({
            isSeller: getCompanyResp.data?.is_seller,
          });
        }
      }
    }, [getCompanyResp.loading]);

    return {
      redirectNode,
    };
};