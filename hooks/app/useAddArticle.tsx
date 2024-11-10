import { articlesKeys } from '@/lib/react-query/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { __apiUrls } from '../api/urls';

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Record<string, any>) => {
      console.log('the form values', values);
      // Pass values as the request body
      const response = await axios.post(
        // __apiUrls.createProduct, 
        __apiUrls.createUserProducts,
        values
      );
      return response.data;
    },
    onSuccess: (data, values) => {
      // Invalidate workspace queries to refresh the data
      queryClient.cancelQueries({ queryKey: articlesKeys.all });
      queryClient.invalidateQueries({ queryKey: articlesKeys.all });
    },
    onMutate: (value: Partial<any>) => {
      const queryKey = articlesKeys.lists();
      const previousData = queryClient.getQueryData<Partial<any>[]>(queryKey);
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Partial<any>[]>(queryKey, oldData => {
        const tempIssue: Partial<any> = {
          ...value,
        };
        return oldData ? [tempIssue, ...oldData] : [tempIssue];
      });
      return previousData;
    },
    onError: (_, __, ctx) => {
      queryClient.setQueryData<Partial<any>[]>(articlesKeys.all, ctx);
    },
  });
};
