import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkPerson } from '../lib/api';

export function useCheckNow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => checkPerson(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['timeline', id] });
      qc.invalidateQueries({ queryKey: ['posts', id] });
      qc.invalidateQueries({ queryKey: ['person', id] });
      qc.invalidateQueries({ queryKey: ['persons'] });
      qc.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}
