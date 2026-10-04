import type { ProfileLink } from '../lib/api';
import StatusDot from './StatusDot';

export default function LinkRow({ link }: { link: ProfileLink }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B0F17] p-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-slate-200">
        {(link.platform[0] ?? '?').toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-slate-200">{link.handle ?? link.url}</p>
        <p className="truncate text-xs text-slate-400">
          {link.platform} · {link.url}
        </p>
      </div>
      <StatusDot status={link.last_status} />
      <span className="text-xs text-slate-400">{link.last_status}</span>
    </div>
  );
}
