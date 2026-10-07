import { NavLink } from 'react-router-dom';
import { Badge, Text } from '@radix-ui/themes';

export default function Sidebar({ unseen }: { unseen: number }) {
  const link = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-[var(--radius-3)] px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[var(--accent-a3)] text-[var(--accent-11)]'
        : 'text-[var(--gray-11)] hover:bg-[var(--gray-a3)] hover:text-[var(--gray-12)]'
    }`;
  return (
    <nav className="border-b border-[var(--gray-a5)] bg-[var(--color-panel-solid)] px-4 py-3 sm:w-60 sm:shrink-0 sm:border-b-0 sm:border-r sm:p-4">
      <Text as="p" size="5" weight="bold" className="mb-3 hidden sm:block">
        Eyes on You
      </Text>
      <div className="flex gap-2 sm:flex-col">
        <NavLink to="/" end className={link}>
          Dashboard
        </NavLink>
        <NavLink to="/alerts" className={link}>
          Alerts
          {unseen > 0 && (
            <Badge color="cyan" variant="solid" radius="full" size="1">
              {unseen}
            </Badge>
          )}
        </NavLink>
        <NavLink to="/new" className={link}>
          + Add person
        </NavLink>
      </div>
    </nav>
  );
}
