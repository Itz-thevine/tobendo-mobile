import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    email: string;
    phone_number: string | number;
    password: string;
}
type dataProps = {
    email?: string,
    phone_number?: string,
    id?: string,
    user_id?: string,
    created_at?: string,
    updated_at?: string,
    is_verify?: boolean,
    profile_pics?: string
}
export const useCreateUserApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.createUser,
                method: 'post',
            });
        },
    };
}