import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    page?: number;
    page_size?: number;
}
export type userProductItem = {
    product_id?: string;
    articleNumber?: number;
    dataSupplierId?: number;
    mfrName?: string;
    genericArticleDescription?: string;
    itemDescription?: string;
    detailDescription?: object;
    legacyArticleId?: string | number;
    assemblyGroupNodeId?: number;
    assemblyGroupName?: string;
    linkageTargetTypes?: string[];
    condition?: "new";
    currency?: string;
    count?: number;
    price?: number;
    gtins?: string[];
    tradeNumbers?: string[];
    oemNumbers?: {
    articleNumber?: string;
    mfrId?: number;
    mfrName?: string
    }[];
    images?: string[];
    car_ids?: number[];
    criteria?: {
        criteriaDescription?: string;
        criteriaUnitDescription?: string;
        criteriaAbbrDescription?: string;
        criteriaType?: string;
        formattedValue?: string;
    }[];
}
type dataProps = {
    result?: userProductItem[];
    page?: number;
    per_page?: number;
    total_pages?: number;
    total_docs?: number;
    next_page?: number;
    prev_page?: number;
}
export const useGetUserProductsApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps?: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.getUserProducts,
            });
        },
    };
}