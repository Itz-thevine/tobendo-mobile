import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    user_id: string;
}
export type sellerOrderItem = {
    order_id?: string;
    buyer_id?: string;
    shipping_address?: string;
    status?: string;
    placed_at?: string;
    items?: {
        price?: number;
        product_id?: string;
        quantity?: number;
    }[];
}
type dataProps = sellerOrderItem[]
export const useGetSellerOrdersApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.getSellerOrders,
            });
        },
    };
}