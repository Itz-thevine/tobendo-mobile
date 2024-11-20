import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    
}
// export type cartItem = {
//     product_id?: string;
//     quantity?: number;
//     price?: number;
//     delivery_date?: string;
// };
export type cartItem = {
    product_id?: string,
    quantity?: number,
    cart_id?: string,
    created_at?: string,
    updated_at?: string,
    product_details?: {
      id?: string,
      articleNumber?: number,
      dataSupplierId?: number,
      mfrName?: string,
      genericArticleDescription?: string,
      itemDescription?: string,
      detailDescription?: object,
      legacyArticleId?: string,
      assemblyGroupNodeId?: number,
      assemblyGroupName?: string,
      linkageTargetTypes?: string[],
      condition?: string,
      currency?: string,
      count?: number,
      price?: number,
      gtins?: string[],
      tradeNumbers?: number[],
      oemNumbers?: {
        articleNumber?: string,
        mfrId?: number,
        mfrName?: string,
      }[],
      images?: string[],
      car_ids?: number[],
      criteria?: null,
      user_id?: string,
      product_id?: string,
      created_at?: string,
      updated_at?: string,
    }
}
type dataProps = cartItem[];
export const useGetCartItemsApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps?: triggerProps) => {
            api.call({
                formObject: triggerProps,
                url: __apiUrls.getCartItems,
            });
        },
    };
}