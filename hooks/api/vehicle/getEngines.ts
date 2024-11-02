import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";

type triggerProps = {
    brand_id: number;
    model_id: number;
}
export type vehicleEngine = {
    mfrId: number;
    mfrName: string;
};
type dataProps = {
    total?: number;
    counts?: vehicleEngine[];
}
export const useGetVehicleEnginesApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps: triggerProps) => {
            api.call({
                url: __apiUrls.getVehicleEngines(triggerProps.brand_id, triggerProps.model_id),
            });
        },
    };
}