import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";
import { cartItem } from "./getCartItems";

type triggerProps = {
    user_id: string;
    payment_method: string;
    shipping_address: string;
    items: cartItem[];
}

type dataProps = {
    
};
export const useCheckoutCartApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.checkoutCart,
                method: 'post',
            });
        },
    };
}