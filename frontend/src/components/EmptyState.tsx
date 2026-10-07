import type { ReactNode } from 'react';
import { Card, Heading, Text } from '@radix-ui/themes';

export default function EmptyState({
  title,
  hint,
  action,
  tone = 'default',
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  tone?: 'default' | 'warn' | 'danger';
}) {
  const border =
    tone === 'warn'
      ? 'border-[var(--amber-a6)]'
      : tone === 'danger'
        ? 'border-[var(--red-a6)]'
        : '';
  return (
    <Card size="3" className={`text-center ${border}`}>
      <Heading size="4">{title}</Heading>
      {hint ? (
        <Text as="p" size="2" color="gray" mt="1">
          {hint}
        </Text>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}
