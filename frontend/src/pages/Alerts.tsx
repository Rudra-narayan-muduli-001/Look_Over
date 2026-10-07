import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Card, Heading, Link as RadixLink, Skeleton, Text } from '@radix-ui/themes';
import { useAlerts, useMarkSeen } from '../hooks/useAlerts';
import DiffBadge from '../components/DiffBadge';
import EmptyState from '../components/EmptyState';

export default function Alerts() {
  const alerts = useAlerts();
  const { markOne, markAll } = useMarkSeen();

  if (alerts.isPending)
    return (
      <div className="mx-auto max-w-2xl space-y-3">
        <Heading size="5">Alerts</Heading>
        {[0, 1, 2].map((i) => (
          <Card key={i} size="2">
            <Skeleton width="140px" height="14px" />
            <Skeleton width="80%" height="12px" />
          </Card>
        ))}
      </div>
    );
  if (alerts.isError)
    return (
      <EmptyState
        title="Couldn't load alerts"
        tone="danger"
        action={
          <Button variant="soft" onClick={() => alerts.refetch()}>
            Retry
          </Button>
        }
      />
    );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center">
        <Heading size="5">Alerts</Heading>
        {alerts.data.length > 0 && (
          <Button
            variant="surface"
            size="1"
            className="ml-auto"
            disabled={markAll.isPending}
            onClick={() => markAll.mutate(undefined)}
          >
            {markAll.isPending ? 'Marking…' : 'Mark all seen'}
          </Button>
        )}
      </div>
      {alerts.data.length === 0 ? (
        <EmptyState title="All caught up" hint="New changes from scheduled or manual checks will appear here." />
      ) : (
        <div className="space-y-3">
          {alerts.data.map((c) => (
            <Card key={c.id} size="2" className="border-[var(--cyan-a6)] bg-[var(--cyan-a2)]">
              <div className="flex items-center gap-2">
                <DiffBadge type={c.type} field={c.field} />
                <RadixLink asChild size="1">
                  <RouterLink to={`/persons/${c.person_id}`}>person #{c.person_id}</RouterLink>
                </RadixLink>
                <Text size="1" color="gray" className="ml-auto">
                  {format(new Date(c.detected_at), 'PPp')}
                </Text>
              </div>
              <Text as="p" size="2" mt="2">
                {c.new_value ?? c.type}
              </Text>
              <Button
                variant="ghost"
                size="1"
                color="cyan"
                mt="2"
                disabled={markOne.isPending}
                onClick={() => markOne.mutate(c.id)}
              >
                Mark seen
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
