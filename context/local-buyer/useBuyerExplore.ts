import { getCustomerProductsTriggerProps, useGetCustomerProductsApi } from "@/hooks/api/user/getCustomerProducts";
import { vehicleEngine } from "@/hooks/api/vehicle/getEngines";
import { vehicleMake } from "@/hooks/api/vehicle/getMakes";
import { vehicleModel } from "@/hooks/api/vehicle/getModels";
import { useEffect, useState } from "react";

export type paginationProps = {
    page?: number;
    page_size?: number;
    total_pages?: number;
    total_docs?: number;
    next_page?: number;
    prev_page?: number;
}
export type productSortOrder = 'asc' | 'desc';
type productFilters = {
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    searchQuery?: string;
    sortOrder?: productSortOrder;
    make?: vehicleMake;
    model?: vehicleModel;
    engine?: vehicleEngine;
    vehicle?: string;
}
export const useBuyerExplore = () => {
    const getApi = useGetCustomerProductsApi();
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
    const filterResult = (items?: typeof states.result) => {
        return states.result?.filter((item) => {
            return (
              (
                !filters.searchQuery
                || (
                  filters.searchQuery
                  && (
                    item.assemblyGroupName?.toLocaleLowerCase().includes(filters.searchQuery.toLowerCase())
                    || item.itemDescription?.toLocaleLowerCase().includes(filters.searchQuery.toLowerCase())
                    || item.genericArticleDescription?.toLocaleLowerCase().includes(filters.searchQuery.toLowerCase())
                    || item.mfrName?.toLocaleLowerCase().includes(filters.searchQuery.toLowerCase())
                  )
                )
              )
              && (
                filters.minPrice === undefined
                || (
                  filters.minPrice !== undefined && (item.price ?? 0) >= filters.minPrice
                )
              )
              && (
                filters.maxPrice === undefined
                || (
                  filters.maxPrice !== undefined && (item.price ?? 0) <= filters.maxPrice
                )
              )
            )
          }).sort((a, b) => {
              return (
                  (filters?.sortOrder === 'asc') ? (a.price ?? 0) - (b.price ?? 0) :
                  (filters?.sortOrder === 'desc') ? (b.price ?? 0) - (a.price ?? 0) :
                  0
              )
          });
    }
    const getProducts = (getProps?: getCustomerProductsTriggerProps) => {
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
                ...(filters.searchQuery ? {search_term: filters.searchQuery} : {}),
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
    
    return {
        data: filterResult(states.result),
        initiallyLoading: states.initiallyLoading,
        loading: getResp.loading,
        pagination: states.pagination,
        filters,
        updateFilters: (newFilters: Partial<productFilters>) => {
            setFilters({
                ...filters,
                ...newFilters,
            });
            resetStates();
            setTimeout(() => {
                getProducts({
                    page: 1,
                });
            }, 200);
        },
        resetStates,
        getProducts,
    };
}