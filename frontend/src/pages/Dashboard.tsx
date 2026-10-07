import { Link } from 'react-router-dom';
import { Button, Card, Heading, Skeleton, Text } from '@radix-ui/themes';
import { usePersons } from '../hooks/usePersons';
import { useUnseenCounts } from '../hooks/useAlerts';
import { useCheckNow } from '../hooks/useCheckNow';
import PersonCard from '../components/PersonCard';
import EmptyState from '../components/EmptyState';

export default function Dashboard() {
  const persons = usePersons();
  const unseen = useUnseenCounts();
  const check = useCheckNow();

  if (persons.isPending)
    return (
      <div>
        <Heading size="5" mb="4">Dashboard</Heading>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} size="2">
              <div className="flex items-center gap-3">
                <Skeleton width="40px" height="40px" />
                <div className="flex-1 space-y-2">
                  <Skeleton width="55%" height="14px" />
                  <Skeleton width="35%" height="10px" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Skeleton width="90px" height="10px" />
                <Skeleton width="72px" height="24px" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  if (persons.isError)
    return (
      <EmptyState
        title="Couldn't load persons"
        hint="Is the API running on http://localhost:8000?"
        tone="danger"
        action={
          <Button variant="soft" onClick={() => persons.refetch()}>
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
          <Button asChild variant="soft">
            <Link to="/new">Add person</Link>
          </Button>
        }
      />
    );

  return (
    <div>
      <Heading size="5" mb="4">Dashboard</Heading>
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
        <Text as="p" size="2" color="red" mt="3">
          A check failed, cards kept. Try again.
        </Text>
      )}
    </div>
  );
}
