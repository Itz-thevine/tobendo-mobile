import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    
}
type addressProps = {
    address_line_1?: string,
    address_line_2?: string,
    city?: string,
    state?: string,
    country?: string,
    postal_code?: string,
    address_id?: string,
    user_id?: string,
    created_at?: string,
    updated_at?: string
};
type dataProps = addressProps[];
export const useGetAddresses = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps?: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.getAddresses,
            });
        },
    };
}