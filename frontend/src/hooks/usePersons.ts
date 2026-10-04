import { useQuery } from '@tanstack/react-query';
import { listPersons } from '../lib/api';

export function usePersons() {
  return useQuery({ queryKey: ['persons'], queryFn: listPersons, staleTime: 30_000 });
}
