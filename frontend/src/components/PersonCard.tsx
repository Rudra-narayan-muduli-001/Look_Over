import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import type { Person } from '../lib/api';
import StatusDot from './StatusDot';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function initials(name: string) {
    return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function PersonCard({
  person,
  unseen,
  onCheck,
  checking,
}: {
  person: Person;
  unseen: number;
  onCheck: () => void;
  checking: boolean;
}) {
  const last = person.links
    .map((l) => l.last_checked_at)
    .filter((t): t is string => !!t)
    .sort()
    .pop();
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        {person.avatar_url ? (
          <img
            src={person.avatar_url}
            alt={person.name}
            className="h-11 w-11 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : null}
        <div
          aria-hidden={!!person.avatar_url}
          className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-slate-200 ${person.avatar_url ? 'hidden' : ''}`}
        >
          {initials(person.name)}
        </div>
        <div className="min-w-0 flex-1">
          <Link to={`/persons/${person.id}`} className="truncate font-semibold hover:text-accent">
            {person.name}
          </Link>
          <div className="mt-1 flex items-center gap-1.5">
            {person.links.map((l) => (
              <StatusDot key={l.id} status={l.last_status} />
            ))}
            {person.links.length === 0 && <span className="text-xs text-slate-400">no links yet</span>}
          </div>
        </div>
        {unseen > 0 && <Badge>{unseen} new</Badge>}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {last ? `checked ${formatDistanceToNow(new Date(last), { addSuffix: true })}` : 'never checked'}
        </span>
        <Button variant="secondary" size="sm" onClick={onCheck} disabled={checking}>
          {checking ? 'Checking…' : 'Check now'}
        </Button>
      </div>
    </Card>
  );
}

