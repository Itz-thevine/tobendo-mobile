import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    email: string;
    new_password: string;
    otp_code: string;
}
// type dataProps = string;
export const useResetPasswordApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            // data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.resetPassword,
                method: 'put',
            });
        },
    };
}