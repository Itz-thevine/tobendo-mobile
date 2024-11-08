import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { __apiBaseUrl } from '../api/urls';


const fetchVehiclesById = async ({car_ids}: {
    car_ids : number[]
}) => {
  try {


    const url = `${__apiBaseUrl}/techallience/get-vehicle-by-id`;

    const { data } = await axios.post(url, {
        car_ids
    });

    return data;
  } catch (error) {
    console.error('Error fetching part suggestion details:', error);
    throw new Error('Failed to fetch part suggestions');
  }
};

export const useFetchVehicleById = ({
    car_ids
  }: {car_ids : number[]}) => {

  return useQuery({
    queryKey: ['categories', car_ids],
    staleTime: 5000,
    queryFn: () => fetchVehiclesById({car_ids}),
    enabled: car_ids.length > 0
  });
};

