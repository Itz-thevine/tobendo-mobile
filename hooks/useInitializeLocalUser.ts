import { useLocalUser } from "@/context/local-user/useLocalUser";
import { useGetUserApi } from "./api/user/getUser";
import { useGetCompanyDetailsApi } from "./api/user/getCompanyDetails";
import { useEffect } from "react";

type useInitializeLocalUserProps = {
    onAuthed?: (authed: boolean) => void;
  }
export const useInitializeLocalUser = (props?: useInitializeLocalUserProps) => {
    const localUser = useLocalUser();
  
    const getUserApi = useGetUserApi();
    const getUserResp = getUserApi.response;
  
    const getCompanyApi = useGetCompanyDetailsApi();
    const getCompanyResp = getCompanyApi.response;
    
    useEffect(() => {
        // console.log('---ran')
      if(localUser?.data?.access_token){
        // console.log('---can get things');
        getUserApi.trigger();
        getCompanyApi.trigger();
      }
      else {
        if(props?.onAuthed) props?.onAuthed(false);
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
        if(props?.onAuthed) props?.onAuthed(authed);
      }
    }, [getUserResp.loading]);
    useEffect(() => {
      if(getCompanyResp.loading && getCompanyResp.success){
        // console.log('-----tell me seller')
        localUser?.update({
          isSeller: getCompanyResp.data?.is_seller,
        });
      }
    }, [getCompanyResp.loading]);

};