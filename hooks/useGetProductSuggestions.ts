import { getCustomerProductsTriggerProps } from "@/hooks/api/user/getCustomerProducts";
import { useEffect, useState } from "react";
import { useGetProductSuggestionsApi } from "./api/user/getProductSuggestions";
import { useScroll } from "./useScroll";

export type paginationProps = {
    page?: number;
    page_size?: number;
    total_pages?: number;
    total_docs?: number;
    next_page?: number;
    prev_page?: number;
}
type productFilters = {
    searchQuery?: string;
}
export const useGetProductSuggestions = () => {
    const scrollHook = useScroll();
    const getApi = useGetProductSuggestionsApi();
    const getResp = getApi.response;
    const [filters, setFilters] = useState<productFilters>({});
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
            pagination: {
                next_page: 1,
            },
            initiallyLoading: undefined,
            resetKey: `${Date.now()}`,
        });
    };
    const getItems = (getProps?: getCustomerProductsTriggerProps) => {
        if(
            states.pagination?.next_page === undefined
            || (
                typeof states.pagination.next_page === 'number'
                && states.pagination.next_page > 0
            )
        ){
            getApi.trigger({
                page: states.pagination?.next_page,
                page_size: 10,
                per_page: 10,
                lang: 'en',
                include_all: false,
                search_type: '99',
                ...(filters.searchQuery ? {search_query: filters.searchQuery} : {}),
                ...getProps,
            });
        }
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
            // else {
            //     newStates.result = {
            //         ...(newStates.result || []),
            //         ...(getResp?.data?.result || []),
            //     };
            // }
        }
        setStates({...newStates});
    }, [getResp?.loading]);
    useEffect(() => {
        const debouncedCall = setTimeout(() => {
            resetStates();
            getItems({
                page: 1,
            });
        }, 200);

        return () => clearTimeout(debouncedCall);
    }, [filters]);
    useEffect(() => {
      if(scrollHook.hasReachedEnd !== false){
        getItems();
      }
    }, [scrollHook.key]);
    
    return {
        data: states.result,
        initiallyLoading: states.initiallyLoading,
        loading: getResp.loading,
        pagination: states.pagination,
        filters,
        updateFilters: (newFilters: Partial<productFilters>) => {
            setFilters({
                ...filters,
                ...newFilters,
            });
        },
        resetStates,
        get: getItems,
        ...scrollHook,
    };
}