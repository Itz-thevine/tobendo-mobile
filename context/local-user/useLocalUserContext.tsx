import { useEffect, useState } from "react";
import { getLocalUser, localUser, setLocalUser, unsetLocalUser, updateLocalUser } from "./local-user-funcs";
import { Href } from "expo-router";
import { otpType } from "@/hooks/api/user/sendUserOtp";
import { useGetUserApi } from "@/hooks/api/user/getUser";
import { useGetCompanyDetailsApi } from "@/hooks/api/user/getCompanyDetails";

type authData = {
    continueRoute?: Href;
    otp?: string;
    otpType?: otpType;
}
export type localUserContext = ReturnType<typeof useLocalUserContext> | undefined;
export const useLocalUserContext = () => {
    const getUserApi = useGetUserApi();
    const getUserResp = getUserApi.response;
  
    const getCompanyApi = useGetCompanyDetailsApi();
    const getCompanyResp = getCompanyApi.response;

    const [authData, setAuthData] = useState<authData>({});
    const [localUserData, setLocalUserData] = useState<localUser | undefined>(undefined);
    const [user, setUser] = useState(getUserResp.data);
    const [company, setCompany] = useState(getCompanyResp.data);

    const update = (localUser: Partial<localUser>) => {
        updateLocalUser(localUser);
        setLocalUserData({
            ...localUserData,
            ...localUser,
        });
    };
    const set = (localUser: localUser) => {
        setLocalUserData(localUser);
        setLocalUser(localUser);
    };
    const unset = () => {
        setLocalUserData(undefined);
        unsetLocalUser();
    };

    useEffect(() => {
        const localUser = getLocalUser();
        setLocalUserData(localUser);
    }, []);
    
    useEffect(() => {
      if(localUserData?.access_token){
        if(!localUserData.user_id) getUserApi.trigger();
        if(localUserData.isSeller === undefined) getCompanyApi.trigger();
      }
    }, [localUserData?.access_token]);
    useEffect(() => {
      console.log('-----getting user', getUserResp);
      if(getUserResp.loading === false){
        let authed = false;
        if(getUserResp.success){
          update({
            user_id: getUserResp.data?.user_id,
            email: getUserResp.data?.email,
          });
          authed = true;
        }
      }
    }, [getUserResp.loading]);
    useEffect(() => {
      console.log('-----getting seller', getCompanyResp);
      if(getCompanyResp.loading === false){
        if(getCompanyResp.success){
          update({
            isSeller: getCompanyResp.data?.is_seller,
          });
        }
      }
    }, [getCompanyResp.loading]);
    
    return {
        authData,
        updateAuthData: (updateProps: Partial<authData>) => {
            setAuthData({
                ...authData,
                ...updateProps,
            });
        },

        data: localUserData,
        company,
        user,
        update,
        set,
        unset,
    };
}