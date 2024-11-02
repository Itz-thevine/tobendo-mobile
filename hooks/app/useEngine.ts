import { useQuery } from '@tanstack/react-query';
import { __apiBaseUrl, __apiUrls } from '../api/urls';

const fetchEngines = async (brandId: string, modelId: string) => {
  const res = await fetch(__apiUrls.getVehicleEngines(brandId, modelId));
  return res.json();
};

export const useEngines = (brandId: string, modelId: string) => {
  return useQuery({
    queryKey: ['engines', brandId, modelId],
    queryFn: () => fetchEngines(brandId, modelId),
    enabled: !!brandId && !!modelId,
  });
};
