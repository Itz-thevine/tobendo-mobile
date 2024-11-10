import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";
import { partDetailsArticleItem } from "../vehicle/getPartSuggestionDetails";
import { userProductItem } from "./getUserProducts";

export type createUserProductTriggerProps = Partial<Omit<userProductItem, 'id'>> & Partial<Omit<partDetailsArticleItem, 'images'>>;
type dataProps = userProductItem;

export const useCreateUserProductsApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps?: createUserProductTriggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.createUserProducts,
                method: 'post',
            });
        },
    };
}