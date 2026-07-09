import { getBooksBySubject, getPopularBooks, searchBooks } from '@/services/api';
import { Book, PaginatedResponse } from '@/types/book';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useBooks(query: string, category: string | null) {
  const limit = 10;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery<PaginatedResponse<Book>, Error>({
    queryKey: ['books', { query, category }],
    queryFn: async ({ pageParam = 1, signal }) => {
      const pageToFetch = pageParam as number;
      if (category) {
        return getBooksBySubject(category, pageToFetch, limit, signal);
      } else if (query.trim()) {
        return searchBooks(query, pageToFetch, limit, signal);
      } else {
        return getPopularBooks(pageToFetch, limit, signal);
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
  });

  // Flatten the pages into a single books array
  const books = data ? data.pages.flatMap((page) => page.data) : [];

  return {
    books,
    loading: isLoading,
    loadingMore: isFetchingNextPage,
    error: error ? error.message : null,
    hasMore: hasNextPage,
    loadMore: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    refresh: refetch,
    retry: refetch,
  };
}
