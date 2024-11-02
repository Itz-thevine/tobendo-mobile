import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

export type vehicleMake = {
    id: number;
    name: string;
    linkageTargetType?: string;
    count?: number;
}
type dataProps = {
    total?: number;
    counts?: vehicleMake[];
}
export const useGetVehicleMakesApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: () => {
            api.call({
                url: __apiUrls.getVehicleMakes,
            });
        },
    };
}