import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Function to build query params by filtering out undefined or null values
const buildQueryParams = (params: { [key: string]: any }) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  return queryParams.toString();
};

const fetchPartSuggestionDetails = async (params: {
  assembly_group_node_id?: number;
  generic_article_id?: number;
  linkage_target_id?: number;
  linkage_target_type?: string;
  search_query: string;
  page: number;
  per_page: number;
  lang?: string;
  include_all?: boolean;
  search_type?: string | number;
}) => {
  try {
    // Set default values directly in the object, so you don't have to check them manually
    const queryParams = buildQueryParams({
      ...params,
      lang: params.lang || 'en', // Set default language to 'en'
      include_all: params.include_all ? 'true' : 'false', // Ensure boolean is converted to string
    });

    const url = `https://c39hsxzv-7500.euw.devtunnels.ms/api/v1/techallieance/part-suggestion-deatils?${queryParams}`;

    const { data } = await axios.get(url);

    return data;
  } catch (error) {
    console.error('Error fetching part suggestion details:', error);
    throw new Error('Failed to fetch part suggestions');
  }
};

export const useProducts = (params: {
  legacy_article_ids?: number
  assembly_group_node_id?: number;
  generic_article_id?: number;
  linkage_target_id?: number;
  linkage_target_type?: string;
  search_query: string;
  page: number;
  per_page: number;
  lang?: string;
  include_all?: boolean;
  search_type?: string | number;
}) => {
  return useQuery({
    queryKey: ['partSuggestionDetails', params],
    queryFn: () => fetchPartSuggestionDetails(params),
    staleTime: 5000,
    // placeholderData: keepPreviousData, 
  });
};
