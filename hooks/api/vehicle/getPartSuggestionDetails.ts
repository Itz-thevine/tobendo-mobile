import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

export type getPartSuggestionDetailsTriggerProps = {
    legacy_article_ids?: number;
    assembly_group_node_id?: number;
    generic_article_id?: number;
    linkage_target_id?: number;
    linkage_target_type?: string;
    search_query?: string;
    page?: number;
    per_page?: number;
    lang?: 'en' | string;
    include_all?: boolean;
    search_type?: number;
}
export type partDetailsArticleItem = {
    articleNumber?: number,
    Description?: string,
    genericArticleId?: number,
    genericArticles?: {
        genericArticleDescription?: string,
    }[],
    legacyArticleId?: number | string,
    linkageTargetTypes?: string[],
    brand_id?: number,
    mfrName?: string,
    "Manufacturer Part Number"?: string,
    mfrId?: number,
    // EAN?: any,
    images?: {
        small?: any,
        medium?: any,
        big?: any
    } | any[],
    articleCriteria?: any[],
}
type dataProps = {
    articles?: partDetailsArticleItem[];
    totalMatchingArticles?: number;
    maxAllowedPage?: number;
};
export const useGetPartSuggestionDetailsApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps?: getPartSuggestionDetailsTriggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.getPartSuggestionDetails,
            });
        },
    };
}