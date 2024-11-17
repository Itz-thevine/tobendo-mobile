import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    
}
// export type cartItem = {
//     product_id?: string;
//     quantity?: number;
//     price?: number;
//     delivery_date?: string;
// };
export type cartItem = {
    cart_id?: string;
    product_id?: string;
    quantity?: number;
    user_id?: string;
    created_at?: string;
    updated_at?: string;
}
type dataProps = cartItem[];
export const useGetCartItemsApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps?: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.getCartItems,
            });
        },
    };
}