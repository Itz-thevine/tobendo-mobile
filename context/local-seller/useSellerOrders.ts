import { useEffect, useState } from "react";
import { sellerOrderItem, useGetSellerOrdersApi } from "../../hooks/api/user/getSellerOrders";
import { useLocalUser } from "../local-user/useLocalUser";

export const useSellerOrders = () => {
    const userId = useLocalUser()?.user?.id;
    const getApi = useGetSellerOrdersApi();
    const getResp = getApi.response;

    const [asNew, setAsNew] = useState(false);
    const [states, setStates] = useState({
        data: getResp?.data,
        initiallyLoading: undefined as boolean | undefined,
        resetKey: '',
        inProgressItems: [] as sellerOrderItem[],
        completedItems: [] as sellerOrderItem[],
        canceledItems: [] as sellerOrderItem[],
    });

    const resetStates = () => {
        setStates({
            data: undefined,
            initiallyLoading: undefined,
            resetKey: `${Date.now()}`,
            inProgressItems: [],
            completedItems: [],
            canceledItems: [],
        });
    };
    const get = (getAsNew?: boolean) => {
        if(userId){
            if(asNew !== (getAsNew ?? true)) setAsNew(getAsNew ?? true);
            getApi.trigger({
                user_id: userId,
            });
        }
    };

    useEffect(() => {
        get();
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

            const inProgressItems: sellerOrderItem[] = [];
            const completedItems: sellerOrderItem[] = [];
            const canceledItems: sellerOrderItem[] = [];

            newStates.data.map((orderItem) => {
                if(orderItem.status === 'completed'){
                    completedItems.push(orderItem);
                }
                else if(orderItem.status === 'canceled'){
                    canceledItems.push(orderItem);
                }
                else {
                    inProgressItems.push(orderItem);
                }
            });

            newStates.inProgressItems = inProgressItems;
            newStates.completedItems = completedItems;
            newStates.canceledItems = canceledItems;
        }
        setStates({...newStates});
    }, [getResp?.loading]);
    
    return {
        data: states.data,
        inProgressItems: states.inProgressItems,
        completedItems: states.completedItems,
        canceledItems: states.canceledItems,
        initiallyLoading: states.initiallyLoading,
        loading: getResp.loading,
        resetStates,
        get,
    };
}