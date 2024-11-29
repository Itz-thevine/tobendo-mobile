import { useEffect, useState } from "react";
import { useGetCartItemsApi } from "../../hooks/api/user-cart/getCartItems";

export const useBuyerCart = () => {
    const getApi = useGetCartItemsApi();
    const getResp = getApi.response;

    const [asNew, setAsNew] = useState(false);
    const [states, setStates] = useState({
        data: getResp?.data,
        initiallyLoading: undefined as boolean | undefined,
        resetKey: '',
    });

    const resetStates = () => {
        setStates({
            data: undefined,
            initiallyLoading: undefined,
            resetKey: `${Date.now()}`,
        });
    };
    const get = (getAsNew?: boolean) => {
        if(asNew !== (getAsNew ?? true)) setAsNew(getAsNew ?? true);
        getApi.trigger();
    };

    useEffect(() => {
        get(true);
    }, []);

    useEffect(() => {
        const newStates = {...states};
        if((newStates.initiallyLoading === undefined || newStates.initiallyLoading === true) && getResp?.loading !== undefined){
            newStates.initiallyLoading = getResp?.loading;
        }

        if(getResp?.loading === false && getResp?.success){
            const orders = getResp.data || [];
            if(asNew){
                newStates.data = orders;
            }
            else {
                newStates.data = [
                    ...(
                        Array.isArray(newStates.data) ? newStates.data :
                        []
                    ),
                    ...orders,
                ];
            }
        }
        setStates({...newStates});
    }, [getResp?.loading]);
    
    return {
        data: states.data,
        initiallyLoading: states.initiallyLoading,
        loading: getResp.loading,
        resetStates,
        get,
    };
}