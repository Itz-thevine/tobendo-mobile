import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

export type otpType = 'forgot_password' | 'email_verification' | 'phone_verification';
type triggerProps = {
    email: string;
    otp_type: otpType;
}
type dataProps = {
    message?: string;
    access_token?: string;
    code?: string;
};
export const useSendUserOtpApi = (props?: useCallApiProps) => {
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