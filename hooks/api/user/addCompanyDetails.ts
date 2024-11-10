import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";
import { companyDetails } from "./getCompanyDetails";

type triggerProps = {
    company_name: string;
    registered_number: string;
    license_type: string;
}
type dataProps = companyDetails;
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
                url: __apiUrls.addCompanyDetails,
                method: 'post',
            });
        },
    };
}