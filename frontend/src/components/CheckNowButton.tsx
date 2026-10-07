import { Button, Text } from '@radix-ui/themes';
import { useCheckNow } from '../hooks/useCheckNow';

export default function CheckNowButton({ personId }: { personId: number }) {
  const check = useCheckNow();
  const busy = check.isPending && check.variables === personId;
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="soft"
        size="2"
        loading={busy}
        disabled={check.isPending}
        onClick={() => check.mutate(personId)}
      >
        Check now
      </Button>
      {check.isError && (
        <Text size="1" color="red">
          check failed
        </Text>
      )}
    </div>
  );
}
