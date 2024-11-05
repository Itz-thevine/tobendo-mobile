import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";
import { otpType } from "./sendUserOtp";

type triggerProps = {
    email: string;
    otp_type: otpType;
    otp_code: string;
}
type dataProps = {
    message?: string;
    user_id?: string;
};
export const useVerifyUserOtpApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.verifyOtp,
                method: 'put',
            });
        },
    };
}