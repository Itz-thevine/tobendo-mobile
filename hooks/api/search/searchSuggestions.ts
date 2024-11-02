import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    query?: string;
}
type dataProps = {
    suggestions?: string[];
    status?: number;
}
export const useSearchSuggestionsApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps: triggerProps) => {
            api.call({
                url: __apiUrls.searchSuggestions(triggerProps.query),
            });
        },
    };
}