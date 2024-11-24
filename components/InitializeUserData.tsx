import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useGetCompanyDetailsApi } from '@/hooks/api/user/getCompanyDetails';
import { useGetUserApi } from '@/hooks/api/user/getUser';

const InitializeUserData = () => {
  const authHook = useAuth();

  const getUserApi = useGetUserApi();
  const getUserResp = getUserApi.response;

  const getCompanyApi = useGetCompanyDetailsApi();
  const getCompanyResp = getCompanyApi.response;
  
  useEffect(() => {
    if(authHook.JWTtoken){
      getUserApi.trigger();
      getCompanyApi.trigger();
    }
  }, [authHook.JWTtoken]);
  useEffect(() => {
    if(getUserResp.loading && getUserResp.success){
      authHook.login(getUserResp.data);
    }
  }, [getUserResp.loading]);
  useEffect(() => {
    if(getCompanyResp.loading && getCompanyResp.success){
      const isSeller = getCompanyResp.data?.is_seller;
      authHook.setIsSeller(isSeller);
    }
  }, [getCompanyResp.loading]);
  // console.log('----initialize-user-data', authHook.JWTtoken, authHook.user)
  return (
    <></>
  );
}

export default InitializeUserData;