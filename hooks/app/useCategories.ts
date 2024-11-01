import { buildQueryParams } from '@/lib';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';


const fetchCategories = async (params: {
  parent_node_id?: number;
  short_cut_id?: number;
  linking_target_id?: number;
  linkage_target_type?: string;
  all_category?: boolean;
  linked?: boolean;
  lang?: string;
}) => {
  try {

    const queryParams = buildQueryParams({
      ...params,
    });

    const url = `https://c39hsxzv-7500.euw.devtunnels.ms/api/v1/techallieance/get-sub-catogery?${queryParams}`;

    const { data } = await axios.get(url);

    return data;
  } catch (error) {
    console.error('Error fetching part suggestion details:', error);
    throw new Error('Failed to fetch part suggestions');
  }
};

export const useCategories = (params: {
  parent_node_id?: number;
  short_cut_id?: number;
  linking_target_id?: number;
  linkage_target_type?: string;
  all_category?: boolean;
  linked?: boolean;
  lang?: string;
  hasChild: boolean
}) => {
  const { hasChild, ...fetchParams } = params;

  return useQuery({
    queryKey: ['categories', fetchParams],
    staleTime: 5000,
    queryFn: () => fetchCategories(fetchParams),
    enabled: hasChild
  });
};

