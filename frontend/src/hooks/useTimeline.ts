import { useQuery } from '@tanstack/react-query';
import { getTimeline } from '../lib/api';

export function useTimeline(id: number) {
  return useQuery({
    queryKey: ['timeline', id],
    queryFn: () => getTimeline(id),
    staleTime: 30_000,
  });
}
