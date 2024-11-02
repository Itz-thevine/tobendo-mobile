import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type item = {
    assemblyGroupName: string;
    assemblyGroupNodeId: number;
    hasChilds?: boolean;
}
type dataProps = {
    data?: {
        array?: item[];
    };
    status?: number;
};
type triggerProps = {
    parent_node_id?: number;
    short_cut_id?: number;
    linking_target_id?: number;
    linking_target_type?: string;
    all_category?: boolean;
    linked?: boolean;
}
export const useGetSubCategoriesApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (params?: triggerProps) => {
            api.call({
                formObject: params,
                url: __apiUrls.getSubCategories,
            });
        },
    };
}