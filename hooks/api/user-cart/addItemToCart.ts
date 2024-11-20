import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    product_id: string;
    quantity: number;
    // user_id: string;
    // items: cartItem;
}

type dataProps = {
    cart_id?: string;
    user_id?: string;
    quantity?: number;
    product_id?: string;
    created_at?: string;
    updated_at?: string;
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
                url: `${__apiUrls.addItemToCart}?product_id=${triggerProps.product_id}&quantity=${triggerProps.quantity}`,
                method: 'post',
            });
        },
    };
}