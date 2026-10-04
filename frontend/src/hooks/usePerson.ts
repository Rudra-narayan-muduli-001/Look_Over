import { useQuery } from '@tanstack/react-query';
import { getPerson } from '../lib/api';

export function usePerson(id: number) {
  return useQuery({
    queryKey: ['person', id],
    queryFn: () => getPerson(id),
    staleTime: 30_000,
  });
}
