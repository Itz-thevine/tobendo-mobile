import { useGetCustomerProductsApi } from "@/hooks/api/user/getCustomerProducts";
import { usePaginatedGet } from "@/hooks/usePaginatedGet";

export const useBuyerExplore = () => {
    const getProductsHook = usePaginatedGet({
        useGetApi: useGetCustomerProductsApi,
        // useGetApiProps: {
        //     searchQuery: '',
        // },
        defaultPagination: {
            page: 1,
            page_size: 3,
        }
    });

    return {
        data: getProductsHook.data,
        initiallyLoading: getProductsHook.initiallyLoading,
        loading: getProductsHook.loading,
        getProducts: () => {
            getProductsHook.trigger({});
        },
    };
}