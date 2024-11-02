import { useQuery } from '@tanstack/react-query';
import { __apiBaseUrl, __apiUrls } from '../api/urls';

const fetchBrands = async () => {
  const res = await fetch(__apiUrls.getVehicleMakes);
  return res.json();
};

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
    initialData: []
  });
};
