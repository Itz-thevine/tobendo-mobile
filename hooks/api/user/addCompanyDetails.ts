import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    company_name: string;
    registered_number: string;
    license_type: string;
}
type dataProps = {
    company_name?: string;
    registered_number?: string;
    license_type?: string;
    id?: string;
    updated_at?: string;
    created_at?: string;
    is_verify?: boolean;
    is_seller_status?: string;
    is_seller?: boolean;
};
export const useAddCompanyDetailsApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.resendOtp,
                method: 'post',
            });
        },
    };
}