import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    user_id: string;
    payment_method: string;
    shipping_address: string;
    items: {
        price: number;
        product_id: string;
        quantity: number;
    }[];
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