import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    
}
type dataItem = {
    id?: string;
    shipping_address?: string;
    items?: {
        price?: number;
        product_id?: string;
        quantity?: number;
    }[];
    delivery_option?: {
        estimated_date?: string;
        fee?: number;
        type?: string;
    };
    status?: string;
}
type dataProps = dataItem[]
export const useGetCustomerOrdersApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps?: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.getCustomerOrders,
            });
        },
    };
}