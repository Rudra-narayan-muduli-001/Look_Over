import { Avatar, Card, Text } from '@radix-ui/themes';
import type { ProfileLink } from '../lib/api';
import StatusDot from './StatusDot';

export default function LinkRow({ link, className }: { link: ProfileLink; className?: string }) {
  return (
    <Card size="1" className={className}>
      <div className="flex items-center gap-3">
        <Avatar
          fallback={(link.platform[0] ?? '?').toUpperCase()}
          size="2"
          radius="full"
          color="gray"
        />
        <div className="min-w-0 flex-1">
          <Text as="p" size="2" truncate>
            {link.handle ?? link.url}
          </Text>
          <Text as="p" size="1" color="gray" truncate>
            {link.platform} · {link.url}
          </Text>
        </div>
        <StatusDot status={link.last_status} />
        <Text size="1" color="gray">
          {link.last_status}
        </Text>
      </div>
    </Card>
  );
}
