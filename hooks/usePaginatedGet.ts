import { useEffect, useState } from "react";
import { ResponseProps, useCallApiProps } from "./api/useCallApi";

type paginationProps = {
    page?: number;
    page_size?: number;
    total_pages?: number;
    total_docs?: number;
    next_page?: number;
    prev_page?: number;
}
type response = ResponseProps;
type responseDataType = Omit<response['data'], 'undefined'>;
type getResponse = Omit<response, 'data'> & {
    data?: responseDataType & paginationProps;
}

// type trigger<T> = (formObject?: any, headers?: apiRequestHeaders) => void;
type trigger<T> = (arg1: T) => void;
type getFuncReturnType<T> = {
    response?: getResponse;
    trigger?: trigger<T>;
};
type useGetApiProps = useCallApiProps;
type useGetApi<T> = (props?: useGetApiProps) => getFuncReturnType<T>;
type usePaginatedGetProps<T> = {
    useGetApi: useGetApi<T>;
    useGetApiProps?: useGetApiProps;
    defaultPagination?: paginationProps;
}

export const usePaginatedGet = <T>(props: usePaginatedGetProps<T>) => {
    const getApi = props.useGetApi(props.useGetApiProps);
    const getResp = getApi.response;
    const [states, setStates] = useState({
        data: getResp?.data,
        pagination: {...props.defaultPagination},
        initiallyLoading: undefined as boolean | undefined,
        resetKey: '',
    });

    const resetStates = () => {
        setStates({
            data: undefined,
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
                next_page: getResp.data?.next_page,
            };
            if(Array.isArray(getResp?.data)){
                newStates.data = [
                    ...(
                        Array.isArray(newStates.data) ? newStates.data :
                        []
                    ),
                    ...(getResp?.data || []),
                ];
            }
            else {
                newStates.data = {
                    ...(newStates.data || []),
                    ...(getResp?.data || []),
                };
            }
        }
        setStates({...newStates});
    }, [getResp?.loading]);

    return {
        initiallyLoading: states.initiallyLoading,
        loading: getResp?.loading,
        pagination: states.pagination,
        data: states.data,
        resetKey: states.resetKey,
        resetStates,
        trigger: (triggerProps: T) => {
            if(getApi.trigger) getApi.trigger({
                ...triggerProps,
                ...states.pagination,
            });
        },
    }
}