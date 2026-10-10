import { useRef } from 'react';
import { Button, Text } from '@radix-ui/themes';
import { useCheckNow } from '../hooks/useCheckNow';
import { buttonPress } from '../lib/animations';

export default function CheckNowButton({ personId }: { personId: number }) {
  const check = useCheckNow();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const busy = check.isPending && check.variables === personId;

  const handleMouseDown = () => {
    if (buttonRef.current) buttonPress(buttonRef.current, true);
  };
  const handleMouseUp = () => {
    if (buttonRef.current) buttonPress(buttonRef.current, false);
  };
  const handleMouseLeave = () => {
    if (buttonRef.current) buttonPress(buttonRef.current, false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        ref={buttonRef}
        variant="soft"
        size="2"
        loading={busy}
        disabled={check.isPending}
        onClick={() => check.mutate(personId)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        aria-busy={busy}
        aria-label={busy ? 'Checking for updates...' : 'Check for updates now'}
      >
        Check now
      </Button>
      {check.isError && (
        <Text size="1" color="red" role="alert">
          check failed
        </Text>
      )}
    </div>
  );
}
