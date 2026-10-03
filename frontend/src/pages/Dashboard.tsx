import { Link } from 'react-router-dom';
import { usePersons } from '../hooks/usePersons';
import { useUnseenCounts } from '../hooks/useAlerts';
import { useCheckNow } from '../hooks/useCheckNow';
import PersonCard from '../components/PersonCard';
import EmptyState from '../components/EmptyState';
import { Button, buttonVariants } from '@/components/ui/button';

export default function Dashboard() {
  const persons = usePersons();
  const unseen = useUnseenCounts();
  const check = useCheckNow();

  if (persons.isPending) return <p className="text-slate-400">Loading persons…</p>;
  if (persons.isError)
    return (
      <EmptyState
        title="Couldn't load persons"
        hint="Is the API running on http://localhost:8000?"
        action={
          <Button variant="secondary" onClick={() => persons.refetch()}>
            Retry
          </Button>
        }
      />
    );
  if (persons.data.length === 0)
    return (
      <EmptyState
        title="No persons yet"
        hint="Add someone to start tracking their public activity."
        action={
          <Link to="/new" className={buttonVariants({ variant: 'secondary' })}>
            Add person
          </Link>
        }
      />
    );

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {persons.data.map((p) => (
          <PersonCard
            key={p.id}
            person={p}
            unseen={unseen.counts.get(p.id) ?? 0}
            onCheck={() => check.mutate(p.id)}
            checking={check.isPending && check.variables === p.id}
          />
        ))}
      </div>
      {check.isError && (
        <p className="mt-3 text-sm text-danger">A check failed — cards kept, try again.</p>
      )}
    </div>
  );
}

