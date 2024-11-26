import React, { useEffect } from 'react';
import { useGetCompanyDetailsApi } from '@/hooks/api/user/getCompanyDetails';
import { useGetUserApi } from '@/hooks/api/user/getUser';
import { useLocalUser } from '@/context/local-user/useLocalUser';

type InitializeUserDataProps = {
  onAuthed?: (authed: boolean) => void;
}
const InitializeUserData = (props: InitializeUserDataProps) => {
  const localUser = useLocalUser();

  const getUserApi = useGetUserApi();
  const getUserResp = getUserApi.response;

  const getCompanyApi = useGetCompanyDetailsApi();
  const getCompanyResp = getCompanyApi.response;
  
  useEffect(() => {
    if(localUser?.data?.access_token){
      getUserApi.trigger();
      getCompanyApi.trigger();
    }
    else {
      if(props.onAuthed) props.onAuthed(false);
    }
  }, [localUser?.data?.access_token]);
  useEffect(() => {
    if(getUserResp.loading){
      let authed = false;
      if(getUserResp.success){
        localUser?.update({
          user_id: getUserResp.data?.user_id,
          email: getUserResp.data?.email,
        });
        authed = true;
      }
      if(props.onAuthed) props.onAuthed(authed);
    }
  }, [getUserResp.loading]);
  useEffect(() => {
    if(getCompanyResp.loading && getCompanyResp.success){
      localUser?.update({
        isSeller: getCompanyResp.data?.is_seller,
      });
    }
  }, [getCompanyResp.loading]);
  // console.log('----initialize-user-data', authHook.JWTtoken, authHook.user)
  return (
    <></>
  );
}

export default InitializeUserData;