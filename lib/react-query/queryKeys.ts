export const articlesKeys = {
    all: ['articlesKeys'] as const,
    lists: () => [...articlesKeys.all, 'list'] as const,
    list: (...filters: string[]) => [...articlesKeys.all, 'list', { ...filters }] as const,
    details: () => [...articlesKeys.all, 'detail'] as const,
    detail: (id: string) => [...articlesKeys.details(), id] as const,
  };
  