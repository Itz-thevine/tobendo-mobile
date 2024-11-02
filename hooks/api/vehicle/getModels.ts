import { __apiUrls } from "../urls";
import { useApi } from "../useApi";
import { useCallApiProps } from "../useCallApi";
import { vehicleMake } from "./getMakes";

type triggerProps = {
    brand_id: number;
}
export type vehicleModel = Pick<vehicleMake, 'id' | 'name' | 'count'>;
type dataProps = {
    total?: number;
    counts?: vehicleModel[];
}
export const useGetVehicleModelsApi = (props?: useCallApiProps) => {
    const api = useApi(props);
    return {
        response: {
            ...api.response,
            data: api.response?.data as dataProps | undefined,
        },
        trigger: (triggerProps: triggerProps) => {
            api.call({
                url: __apiUrls.getVehicleModels(triggerProps.brand_id),
            });
        },
    };
}