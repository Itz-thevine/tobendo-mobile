import { useEffect, useState } from "react";
import { useScroll } from "./useScroll";
import { getPartSuggestionDetailsTriggerProps, useGetPartSuggestionDetailsApi } from "./api/vehicle/getPartSuggestionDetails";

export type paginationProps = {
    page?: number;
    per_page?: number;
}
type productFilters = {
    searchQuery?: string;
}
export const useGetPartSuggestions = () => {
    const scrollHook = useScroll();
    const getApi = useGetPartSuggestionDetailsApi();
    const getResp = getApi.response;
    const [filters, setFilters] = useState<productFilters>({});
    const [states, setStates] = useState({
        articles: getResp?.data?.articles,
        pagination: {
            page: 1,
        } as paginationProps | undefined,
        initiallyLoading: undefined as boolean | undefined,
        resetKey: '',
    });

    const resetStates = () => {
        setStates({
            articles: undefined,
            pagination: {
                page: 1,
            },
            initiallyLoading: undefined,
            resetKey: `${Date.now()}`,
        });
    };
    const getItems = (getProps?: getPartSuggestionDetailsTriggerProps) => {
        if(
            states.pagination?.page === undefined
            || (
                typeof states.pagination.page === 'number'
                && states.pagination.page > 0
            )
        ){
            getApi.trigger({
                page: states.pagination?.page,
                per_page: 10,
                lang: 'en',
                include_all: false,
                search_type: 99,
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
                page: (newStates.pagination?.page ?? 0) + 1,
            };
            if(Array.isArray(getResp?.data?.articles)){
                newStates.articles = [
                    ...(
                        Array.isArray(newStates.articles) ? newStates.articles :
                        []
                    ),
                    ...(getResp?.data?.articles || []),
                ];
            }
            // else {
            //     newStates.articles = {
            //         ...(newStates.articles || []),
            //         ...(getResp?.data?.articles || []),
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
        data: states.articles,
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