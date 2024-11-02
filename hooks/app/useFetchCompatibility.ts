import { useQuery } from '@tanstack/react-query';
import { __apiBaseUrl } from '../api/urls';

// Function to fetch compatibility data
const fetchCompatibility = async ({ articleId, linkageType, lang }: {
    articleId: number,
    linkageType: string,
    lang: string,
}) => {
  const url = new URL(`${__apiBaseUrl}/techallieance/get-part-link-with-car/${articleId}`);
  url.searchParams.append('linkage_type', linkageType);
  url.searchParams.append('lang', lang);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export const useFetchCompatibility = ({ 
    articleId= 0, 
    linkageType = 'P', 
    lang = 'en', 
  } = {}) => {
  return useQuery({
    queryKey: ['compatibility', articleId, linkageType, lang],
    queryFn: () => fetchCompatibility({ articleId, linkageType, lang }),
    enabled: !!articleId,
  });
};
