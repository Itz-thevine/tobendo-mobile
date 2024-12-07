import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    
}
export type orderItem = {
    created_at?: string,
    delivery_option?: {
      estimated_date?: string;
      fee?: number;
      type?: string;
    };
    items?: {
        price?: number;
        product_id?: string;
        quantity?: number;
    }[];
    order_id?: string;
    payment_method?: {
      details?: string;
      method?: string;
    };
    placed_at?: string;
    shipping_address?: string;
    status?: 'completed' | 'canceled' | 'in_progress';
    total_price?: number;
    updated_at?: string;
    user_id?: number;
}
type dataProps = orderItem[]
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