import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    grant_type?: 'password';
    username: string;
    password: string;
}
type dataProps = {
    access_token?: string;
    token_type?: string;
    refresh_token?: string;
    is_verify?: boolean;
}
export const useSignInApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.signIn,
                method: 'post',
                endContentType: 'form-data',
            });
        },
    };
}