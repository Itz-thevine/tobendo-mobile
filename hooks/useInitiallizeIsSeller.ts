import { useLocalUser } from "@/context/local-user/useLocalUser";
import { useGetCompanyDetailsApi } from "./api/user/getCompanyDetails";
import { useEffect, useState } from "react";

type useInitializeIsSellerProps = {
    onInitialized?: (isSeller: boolean) => void;
  }
export const useInitializeIsSeller = (props?: useInitializeIsSellerProps) => {
    const localUser = useLocalUser();
    const [initialized, setInitialized] = useState(false);
    
    const getCompanyApi = useGetCompanyDetailsApi();
    const getCompanyResp = getCompanyApi.response;

    useEffect(() => {
      if(getCompanyResp.loading === false){
        let isSeller = false;
        if(getCompanyResp.success){
          isSeller = getCompanyResp.data?.is_seller ?? false;
        }
        localUser?.update({
          isSeller,
        });
        if(props?.onInitialized) props?.onInitialized(isSeller);
        setInitialized(true);
      }
    }, [getCompanyResp.loading]);

    return {
      initialized,
      loading: getCompanyResp.loading,
      initialize: () => {
        getCompanyApi.trigger();
      },
    };
};