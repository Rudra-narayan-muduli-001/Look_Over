const STATUS_LABELS: Record<string, string> = {
  ok: 'Online',
  blocked: 'Blocked',
  needs_login: 'Needs login',
  rate_limited: 'Rate limited',
  never: 'Never checked',
};

const COLORS: Record<string, string> = {
  ok: 'var(--green-9)',
  blocked: 'var(--amber-9)',
  needs_login: 'var(--amber-9)',
  rate_limited: 'var(--amber-9)',
  never: 'var(--gray-8)',
};

export default function StatusDot({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span
      title={label}
      aria-label={`Status: ${label}`}
      className="inline-flex items-center gap-1.5"
    >
      <span
        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: COLORS[status] ?? 'var(--red-9)' }}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
