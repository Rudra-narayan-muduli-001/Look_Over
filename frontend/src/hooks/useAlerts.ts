import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAlerts, markAlertsSeenAll, markChangeSeen } from '../lib/api';

export function useAlerts(personId?: number) {
  return useQuery({
    queryKey: ['alerts', personId ?? 'all'],
    queryFn: () => getAlerts(true, personId),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

/** Per-person unseen counts for dashboard badges (single shared query). */
export function useUnseenCounts() {
  const q = useAlerts();
  const counts = useMemo(() => {
    const m = new Map<number, number>();
    for (const c of q.data ?? []) m.set(c.person_id, (m.get(c.person_id) ?? 0) + 1);
    return m;
  }, [q.data]);
  return { ...q, counts };
}

export function useMarkSeen() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['alerts'] });
    qc.invalidateQueries({ queryKey: ['timeline'] });
  };
  const one = useMutation({ mutationFn: markChangeSeen, onSuccess: invalidate });
  const all = useMutation({
    mutationFn: (person_id?: number) => markAlertsSeenAll(person_id),
    onSuccess: invalidate,
  });
  return { markOne: one, markAll: all };
}
