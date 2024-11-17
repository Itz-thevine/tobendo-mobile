import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";
import { userProductItem } from "./getUserProducts";

type triggerProps = {
    product_id?: string;
    search_term?: string;
    car_id?: string;
    linkage_target_id?: string;
    category?: string;
    page?: number;
    page_size?: number;
}
export type customerProductItem = Omit<userProductItem, 'id'> & {
    id?: string;
}
type dataProps = {
    result?: customerProductItem[];
    page?: number;
    page_size?: number;
    total_pages?: number;
    total_docs?: number;
    next_page?: number;
    prev_page?: number;
}
export const useGetCustomerProductsApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps?: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.getCustomerProducts,
            });
        },
    };
}