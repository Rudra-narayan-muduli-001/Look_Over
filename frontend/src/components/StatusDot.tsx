const GREEN = 'bg-[#34D399]';
const AMBER = 'bg-[#F59E0B]';
const GRAY = 'bg-slate-500';
const RED = 'bg-[#F87171]';

export default function StatusDot({ status }: { status: string }) {
  const color =
    status === 'ok'
      ? GREEN
      : status === 'blocked' || status === 'needs_login' || status === 'rate_limited'
        ? AMBER
        : status === 'never'
          ? GRAY
          : RED;
  return (
    <span
      title={status}
      aria-label={`status: ${status}`}
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${color}`}
    />
  );
}
