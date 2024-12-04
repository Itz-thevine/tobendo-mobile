import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";
import { userProductItem } from "./getUserProducts";

export type createUserProductTriggerProps = {
    store_name: string;
    articleNumber: number,
    dataSupplierId: number,
    mfrName: string,
    genericArticleDescription: string,
    itemDescription: string,
    detailDescription: {},
    legacyArticleId: string,
    assemblyGroupNodeId: number,
    assemblyGroupName: string,
    linkageTargetTypes: string[],
    condition: 'new',
    currency: string,
    count: number,
    price: number,
    gtins: string[],
    tradeNumbers: string[],
    oemNumbers: {
      articleNumber: string,
      mfrId: number,
      mfrName: string
    }[],
    images: string[],
    car_ids: number[],
    criteria: {
        criteriaDescription: string,
        criteriaUnitDescription: string,
        criteriaAbbrDescription: string,
        criteriaType: string,
        formattedValue: string
    }[],
};
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