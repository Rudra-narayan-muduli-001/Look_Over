const COLORS: Record<string, string> = {
  ok: 'var(--green-9)',
  blocked: 'var(--amber-9)',
  needs_login: 'var(--amber-9)',
  rate_limited: 'var(--amber-9)',
  never: 'var(--gray-8)',
};

export default function StatusDot({ status }: { status: string }) {
  return (
    <span
      title={status}
      aria-label={`status: ${status}`}
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
      style={{ backgroundColor: COLORS[status] ?? 'var(--red-9)' }}
    />
  );
}
