import { useQuery } from '@tanstack/react-query';
import { __apiBaseUrl, __apiUrls } from '../api/urls';

const fetchModels = async (brandId: string) => {
  const res = await fetch(__apiUrls.getVehicleModels(brandId));
  return res.json();
};

export const useModels = (brandId: string) => {
  return useQuery({
    queryKey: ['models', brandId],
    queryFn: () => fetchModels(brandId),
    enabled: !!brandId,
  });
};
