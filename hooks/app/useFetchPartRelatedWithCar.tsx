import { buildQueryParams } from '@/lib';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';


const FetchPartRelatedWithCar = async (params: {
    legacy_article_id: number;
    linkage_type?: string;
    lang?: string;
}) => {
  try {

    const queryParams = buildQueryParams({
      ...params,
    });

    const url = `https://c39hsxzv-7500.euw.devtunnels.ms/api/v1/techallieance/get-part-link-with-car/${params.legacy_article_id}`;

    const { data } = await axios.get(url, {params});

    return data;
  } catch (error) {
    console.error('Error fetching part suggestion details:', error);
    throw new Error('Failed to fetch part suggestions');
  }
};

export const useFetchPartRelatedWithCar = (params: {
  legacy_article_id: number;
  linkage_type?: string;
  lang?: string;
}) => {

  return useQuery({
    queryKey: ['article-car-link', params],
    staleTime: 5000,
    queryFn: () => FetchPartRelatedWithCar(params),
  });
};

