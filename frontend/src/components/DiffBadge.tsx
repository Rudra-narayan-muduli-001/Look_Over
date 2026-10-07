import { Badge } from '@radix-ui/themes';

export default function DiffBadge({ type, field }: { type: string; field?: string | null }) {
  if (type === 'new_post')
    return (
      <Badge color="cyan" variant="soft">
        NEW POST
      </Badge>
    );
  if (type === 'deleted')
    return (
      <Badge color="red" variant="soft">
        DELETED
      </Badge>
    );
  if (type === 'blocked')
    return (
      <Badge color="amber" variant="soft">
        BLOCKED
      </Badge>
    );
  if (type === 'field_change')
    return (
      <Badge color="green" variant="soft">
        {(field ?? 'changed').replace(/_/g, ' ').toUpperCase()}
      </Badge>
    );
  return <Badge variant="outline">{type.replace(/_/g, ' ').toUpperCase()}</Badge>;
}
