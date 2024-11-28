import { getCustomerProductsTriggerProps, useGetCustomerProductsApi } from "@/hooks/api/user/getCustomerProducts";
import { useEffect, useState } from "react";

type paginationProps = {
    page?: number;
    page_size?: number;
    total_pages?: number;
    total_docs?: number;
    next_page?: number;
    prev_page?: number;
}
export const useBuyerExplore = () => {
    const getApi = useGetCustomerProductsApi();
    const getResp = getApi.response;
    const [states, setStates] = useState({
        result: getResp?.data?.result,
        pagination: {
            next_page: 1,
        } as paginationProps | undefined,
        initiallyLoading: undefined as boolean | undefined,
        resetKey: '',
    });

    const resetStates = () => {
        setStates({
            result: undefined,
            pagination: {},
            initiallyLoading: undefined,
            resetKey: `${Date.now()}`,
        });
    };

    useEffect(() => {
        const newStates = {...states};
        if((newStates.initiallyLoading === undefined || newStates.initiallyLoading === true) && getResp?.loading !== undefined){
            newStates.initiallyLoading = getResp?.loading;
        }

        if(getResp?.loading === false && getResp?.success){
            newStates.pagination = {
                ...newStates.pagination,
                page: getResp.data?.page,
                page_size: getResp.data?.page_size,
                prev_page: getResp.data?.prev_page,
                next_page: getResp.data?.next_page,
                total_pages: getResp.data?.total_pages,
                total_docs: getResp.data?.total_docs,
            };
            if(Array.isArray(getResp?.data?.result)){
                newStates.result = [
                    ...(
                        Array.isArray(newStates.result) ? newStates.result :
                        []
                    ),
                    ...(getResp?.data?.result || []),
                ];
            }
            else {
                newStates.result = {
                    ...(newStates.result || []),
                    ...(getResp?.data?.result || []),
                };
            }
        }
        setStates({...newStates});
    }, [getResp?.loading]);
    
    return {
        data: states.result,
        initiallyLoading: states.initiallyLoading,
        loading: getResp.loading,
        pagination: states.pagination,
        resetStates,
        getProducts: (getProps?: getCustomerProductsTriggerProps) => {
            if(
                states.pagination?.next_page === undefined
                || (
                    typeof states.pagination.next_page === 'number'
                    && states.pagination.next_page > 0
                )
            ){
                getApi.trigger({
                    ...getProps,
                    page: states.pagination?.next_page,
                    page_size: 3,
                });
            }
        },
    };
}