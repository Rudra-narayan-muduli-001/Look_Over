import { format } from 'date-fns';
import type { Change } from '../lib/api';
import DiffBadge from './DiffBadge';

export default function TimelineItem({
  change,
  onSeen,
  marking,
}: {
  change: Change;
  onSeen: () => void;
  marking: boolean;
}) {
  const fresh = !change.seen;
  return (
    <div
      className={`rounded-xl border p-3 ${
        fresh ? 'border-[#22D3EE]/40 bg-[#131A26] ring-1 ring-[#22D3EE]/30' : 'border-white/10 bg-[#131A26]'
      }`}
    >
      <div className="flex items-center gap-2">
        <DiffBadge type={change.type} field={change.field} />
        <span className="ml-auto text-xs text-slate-400">
          {format(new Date(change.detected_at), 'PPpp')}
        </span>
      </div>
      {change.type === 'field_change' ? (
        <p className="mt-2 text-sm text-slate-200">
          <span className="text-slate-400 line-through">{change.old_value ?? '—'}</span>
          <span className="mx-2 text-slate-400">→</span>
          <span>{change.new_value ?? '—'}</span>
        </p>
      ) : (
        <p className="mt-2 text-sm text-slate-200">{change.new_value ?? change.type}</p>
      )}
      {fresh && (
        <button
          type="button"
          onClick={onSeen}
          disabled={marking}
          className="mt-2 text-xs font-medium text-[#22D3EE] hover:underline disabled:opacity-50"
        >
          {marking ? 'Marking…' : 'Mark seen'}
        </button>
      )}
    </div>
  );
}
