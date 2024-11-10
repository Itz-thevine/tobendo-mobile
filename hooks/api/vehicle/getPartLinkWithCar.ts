import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    legacyArticleId: number;
    linkage_type?: 'P' | string;
    lang?: string;
}
type dataProps = number[];
export const useGetPartLinkWithCarApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.getPartLinkWithCar(triggerProps.legacyArticleId),
            });
        },
    };
}