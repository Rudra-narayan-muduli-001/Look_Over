import { useAlerts, useMarkSeen } from '../hooks/useAlerts';
import DiffBadge from '../components/DiffBadge';
import EmptyState from '../components/EmptyState';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Alerts() {
  const alerts = useAlerts();
  const { markOne, markAll } = useMarkSeen();

  if (alerts.isPending) return <p className="text-slate-400">Loading alerts…</p>;
  if (alerts.isError)
    return (
      <EmptyState
        title="Couldn't load alerts"
        action={
          <button
            type="button"
            onClick={() => alerts.refetch()}
            className="rounded-xl bg-[#22D3EE]/15 px-4 py-2 text-sm font-semibold text-[#22D3EE]"
          >
            Retry
          </button>
        }
      />
    );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center">
        <h1 className="text-xl font-bold text-slate-200">Alerts</h1>
        {alerts.data.length > 0 && (
          <button
            type="button"
            onClick={() => markAll.mutate(undefined)}
            disabled={markAll.isPending}
            className="ml-auto rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5 disabled:opacity-50"
          >
            {markAll.isPending ? 'Marking…' : 'Mark all seen'}
          </button>
        )}
      </div>
      {alerts.data.length === 0 ? (
        <EmptyState title="All caught up" hint="New changes from scheduled or manual checks will appear here." />
      ) : (
        <div className="space-y-3">
          {alerts.data.map((c) => (
            <div key={c.id} className="rounded-xl border border-[#22D3EE]/40 bg-[#131A26] p-3 ring-1 ring-[#22D3EE]/30">
              <div className="flex items-center gap-2">
                <DiffBadge type={c.type} field={c.field} />
                <Link to={`/persons/${c.person_id}`} className="text-xs text-[#22D3EE] hover:underline">
                  person #{c.person_id}
                </Link>
                <span className="ml-auto text-xs text-slate-400">
                  {format(new Date(c.detected_at), 'PPp')}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-200">{c.new_value ?? c.type}</p>
              <button
                type="button"
                onClick={() => markOne.mutate(c.id)}
                disabled={markOne.isPending}
                className="mt-2 text-xs font-medium text-[#22D3EE] hover:underline disabled:opacity-50"
              >
                Mark seen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
