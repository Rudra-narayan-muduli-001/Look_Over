import { useCheckNow } from '../hooks/useCheckNow';
import { Button } from '@/components/ui/button';

export default function CheckNowButton({ personId }: { personId: number }) {
  const check = useCheckNow();
  const busy = check.isPending && check.variables === personId;
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={() => check.mutate(personId)} disabled={check.isPending}>
        {busy ? 'Checking…' : 'Check now'}
      </Button>
      {check.isError && <span className="text-xs text-danger">check failed — card kept</span>}
    </div>
  );
}

