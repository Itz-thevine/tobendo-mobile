import { useLocalUser } from "@/context/local-user/useLocalUser";
import { useEffect, useState } from "react";
import { Redirect, useRootNavigationState } from "expo-router";
import { useGetUserApi } from "./api/user/getUser";
import { useGetCompanyDetailsApi } from "./api/user/getCompanyDetails";
import { useLocalBuyer } from "../context/local-buyer/useLocalBuyer";

export const useInitializeLocalUser = () => {
    const localUser = useLocalUser();
    const localBuyer = useLocalBuyer();
    const cartHook = localBuyer?.cart;

    const rootNavigationState = useRootNavigationState();
    const localUserId = localUser?.data?.user_id;
    const [redirectNode, setRedirectNode] = useState<React.ReactNode | undefined>(undefined);
    
    const getUserApi = useGetUserApi();
    const getUserResp = getUserApi.response;
  
    const getCompanyApi = useGetCompanyDetailsApi();
    const getCompanyResp = getCompanyApi.response;

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
        if(!localUser?.data.user_id) getUserApi.trigger();
        if(localUser?.data.isSeller === undefined) getCompanyApi.trigger();
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
          localUser?.setUser(getUserResp.data);
          authed = true;
        }
      }
    }, [getUserResp.loading]);
    useEffect(() => {
      if(getCompanyResp.loading === false){
        if(getCompanyResp.success){
          localUser?.update({
            isSeller: getCompanyResp.data?.is_seller,
          });
          localUser?.setCompany(getCompanyResp.data);
        }
      }
    }, [getCompanyResp.loading]);
    useEffect(() => {
      if(getUserResp.data?.user_id){
        // orderHook?.get();
        cartHook?.get();
      }
    }, [getUserResp.data?.user_id]);

    return {
      redirectNode,
    };
};