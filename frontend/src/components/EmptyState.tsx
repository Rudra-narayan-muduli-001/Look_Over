import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <p className="text-lg font-semibold">{title}</p>
        {hint ? <p className="mt-1 text-sm text-slate-400">{hint}</p> : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </CardContent>
    </Card>
  );
}

