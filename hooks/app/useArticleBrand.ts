import { buildQueryParams } from '@/lib';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { __apiBaseUrl, __apiUrls } from '../api/urls';

const fetchCategories = async (params: {
 lang: Lang
}) => {
  try {
    const queryParams = buildQueryParams({
      ...params,
    });

    const url = `${__apiBaseUrl}/techallieance/get-product-brand?${queryParams}`;

    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error('Error fetching part suggestion details:', error);
    throw new Error('Failed to fetch part suggestions');
  }
};

type Lang = 'en'
export const useArticleBrand = (params: {
  lang: Lang
}) => {

  return useQuery({
    queryKey: ['brands', params],
    staleTime: 5000,
    queryFn: () => fetchCategories(params),
  });
};

