import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../lib/api';

export function usePosts(id: number) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => getPosts(id),
    staleTime: 30_000,
  });
}
