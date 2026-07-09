import { useQuery } from '@tanstack/react-query';
import { Book } from '@/types/book';
import { getBookDetails } from '@/services/api';

export function useBookDetails(workId: string) {
  const { data, isLoading, error, refetch } = useQuery<Book>({
    queryKey: ['book', workId],
    queryFn: ({ signal }) => getBookDetails(workId, signal),
    enabled: !!workId,
  });

  return {
    book: data || null,
    loading: isLoading,
    error: error ? error.message : null,
    retry: refetch,
  };
}
