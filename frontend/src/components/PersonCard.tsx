import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, Badge, Button, Card, Link as RadixLink, Text } from '@radix-ui/themes';
import type { Person } from '../lib/api';
import StatusDot from './StatusDot';
import { cardHover } from '../lib/animations';

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
  const cardRef = useRef<HTMLDivElement>(null);
  const last = person.links
    .map((l) => l.last_checked_at)
    .filter((t): t is string => !!t)
    .sort()
    .pop();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMouseEnter = () => cardHover(card, true);
    const handleMouseLeave = () => cardHover(card, false);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Card
      size="2"
      className="person-card transition-shadow duration-150 focus-within:ring-2 focus-within:ring-[var(--accent-9)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-background)]"
      ref={cardRef}
      tabIndex={0}
    >
      <div className="flex items-center gap-3">
        <Avatar
          src={person.avatar_url ?? undefined}
          fallback={initials(person.name)}
          size="3"
          radius="full"
        />
        <div className="min-w-0 flex-1">
          <RadixLink asChild weight="medium" className="block truncate">
            <Link to={`/persons/${person.id}`}>{person.name}</Link>
          </RadixLink>
          <div className="mt-1 flex items-center gap-1.5">
            {person.links.map((l) => (
              <StatusDot key={l.id} status={l.last_status} />
            ))}
            {person.links.length === 0 && (
              <Text size="1" color="gray">
                no links yet
              </Text>
            )}
          </div>
        </div>
        {unseen > 0 && (
          <Badge color="cyan" variant="solid" radius="full">
            {unseen} new
          </Badge>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Text size="1" color="gray">
          {last ? `checked ${formatDistanceToNow(new Date(last), { addSuffix: true })}` : 'never checked'}
        </Text>
        <Button variant="soft" size="1" loading={checking} disabled={checking} onClick={onCheck}>
          Check now
        </Button>
      </div>
    </Card>
  );
}
