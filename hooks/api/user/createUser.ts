import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";
import { userProps } from "./getUser";

type triggerProps = {
    email: string;
    phone_number: string | number;
    password: string;
}
type dataProps = userProps;
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