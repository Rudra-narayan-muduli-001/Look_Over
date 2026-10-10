import { format } from 'date-fns';
import { Button, Card, Text } from '@radix-ui/themes';
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
    <Card
      size="2"
      className={`${fresh ? 'border-[var(--cyan-a6)] bg-[var(--cyan-a2)]' : ''} timeline-item`}
    >
      <div className="flex items-center gap-2">
        <DiffBadge type={change.type} field={change.field} />
        <Text size="1" color="gray" className="ml-auto">
          {format(new Date(change.detected_at), 'PPpp')}
        </Text>
      </div>
      {change.type === 'field_change' ? (
        <Text as="p" size="2" mt="2">
          <Text color="gray" className="line-through">
            {change.old_value ?? '(empty)'}
          </Text>
          <Text color="gray" mx="2">
            →
          </Text>
          <Text>{change.new_value ?? '(empty)'}</Text>
        </Text>
      ) : (
        <Text as="p" size="2" mt="2">
          {change.new_value ?? change.type}
        </Text>
      )}
      {fresh && (
        <Button
          variant="ghost"
          size="1"
          color="cyan"
          mt="2"
          disabled={marking}
          onClick={onSeen}
        >
          {marking ? 'Marking…' : 'Mark seen'}
        </Button>
      )}
    </Card>
  );
}
