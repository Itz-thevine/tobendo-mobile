import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";
import { cartItem } from "./getCartItems";

type triggerProps = {
    user_id: string;
    items: cartItem;
}

type dataProps = {
    cart_id?: string;
    user_id?: string;
    quantity?: number;
    created_at?: string;
    updated_at?: string;
    // cart_item_id?: string;
    // product_id?: string;
    // quantity?: number;
    // price?: number;
    // added_at?: string;
    // delivery_date?: string;
};
export const useAddItemToCartApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.addItemToCart,
                // method: 'post',
            });
        },
    };
}