import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Define the fetch function to get autocomplete suggestions
const fetchAutoCompleteSuggestions = async (searchQuery: string) => {
  if (!searchQuery) return [];
  
  try {
    const { data } = await axios.get(`https://c39hsxzv-7500.euw.devtunnels.ms/api/v1/techallieance/auto-complete-suggestion/${searchQuery}?lang=en`);
    // const { data } = await axios.get(`${process.env.EXPO_PUBLIC_BASE_URL}/techallieance/auto-complete-suggestion/${searchQuery}`);
    return data; 
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return [];
  }
};

// Custom hook to use the autocomplete suggestions
export const useAutoCompleteSuggestions = (searchQuery: string) => {
    return useQuery({
        queryKey: ['autoCompleteSuggestions', searchQuery],
        queryFn: () => fetchAutoCompleteSuggestions(searchQuery),
        placeholderData: keepPreviousData,
      });
};
