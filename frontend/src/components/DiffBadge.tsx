import { Badge } from '@/components/ui/badge';

export default function DiffBadge({ type, field }: { type: string; field?: string | null }) {
  if (type === 'new_post') return <Badge variant="secondary">NEW POST</Badge>;
  if (type === 'deleted') return <Badge variant="destructive">DELETED</Badge>;
  if (type === 'blocked') return <Badge variant="warn">BLOCKED</Badge>;
  if (type === 'field_change')
    return <Badge variant="success">{(field ?? 'changed').replace(/_/g, ' ').toUpperCase()}</Badge>;
  return <Badge variant="outline">{type.replace(/_/g, ' ').toUpperCase()}</Badge>;
}

