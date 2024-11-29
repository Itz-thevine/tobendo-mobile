import { useEffect, useState } from "react";
import { getLocalUser, localUser, setLocalUser, unsetLocalUser, updateLocalUser } from "./local-user-funcs";
import { Href } from "expo-router";
import { otpType } from "@/hooks/api/user/sendUserOtp";
import { userProps } from "@/hooks/api/user/getUser";
import { companyDetails } from "@/hooks/api/user/getCompanyDetails";

type authData = {
    continueRoute?: Href;
    otp?: string;
    otpType?: otpType;
}
export type localUserContext = ReturnType<typeof useLocalUserContext> | undefined;
export const useLocalUserContext = () => {
    const [authData, setAuthData] = useState<authData>({});
    const [localUserData, setLocalUserData] = useState<localUser | undefined>(undefined);
    const [user, setUser] = useState<userProps | undefined>(undefined);
    const [company, setCompany] = useState<companyDetails | undefined>(undefined);

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
        setUser,
        setCompany,
    };
}