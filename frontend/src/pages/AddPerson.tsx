import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Callout,
  Card,
  Heading,
  Select,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes';
import { addLink, checkPerson, createPerson } from '../lib/api';
import type { Platform } from '../lib/api';

const PLATFORMS: Platform[] = ['github', 'x', 'instagram', 'facebook', 'linkedin', 'other'];

export default function AddPerson() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [rows, setRows] = useState<Array<{ platform: Platform; url: string }>>([
    { platform: 'github', url: '' },
  ]);
  const [personId, setPersonId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const create = async () => {
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const p = await createPerson({ name: name.trim(), notes: notes.trim() || undefined });
      setPersonId(p.id);
      setStep(2);
    } catch {
      setError('Could not create person. Is the API running?');
    } finally {
      setBusy(false);
    }
  };

  const finish = async () => {
    if (personId == null) return;
    setBusy(true);
    setError('');
    try {
      for (const r of rows) {
        if (r.url.trim()) await addLink(personId, { platform: r.platform, url: r.url.trim() });
      }
      await checkPerson(personId); // auto-fire first check → baseline
      nav(`/persons/${personId}`);
    } catch {
      setError('Something failed (create ok, link/check failed). You can retry from Settings.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <Heading size="5" mb="4">
        Add person{' '}
        <Text size="2" weight="regular" color="gray">
          (step {step} of 2)
        </Text>
      </Heading>
      {error && (
        <Callout.Root color="red" variant="soft" mb="3">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      {step === 1 ? (
        <Card size="3">
          <div className="space-y-3">
            <TextField.Root
              size="2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextArea
              placeholder="Notes (optional)"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div>
              <Button loading={busy} disabled={busy} onClick={create}>
                Continue
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card size="3">
          <div className="space-y-3">
            {rows.map((r, i) => (
              <div key={i} className="flex gap-2">
                <Select.Root
                  value={r.platform}
                  onValueChange={(v) =>
                    setRows((rs) =>
                      rs.map((x, j) => (j === i ? { ...x, platform: v as Platform } : x))
                    )
                  }
                >
                  <Select.Trigger className="w-36" />
                  <Select.Content>
                    {PLATFORMS.map((p) => (
                      <Select.Item key={p} value={p}>
                        {p}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <TextField.Root
                  className="flex-1"
                  size="2"
                  placeholder="https://…"
                  value={r.url}
                  onChange={(e) =>
                    setRows((rs) => rs.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))
                  }
                />
                {rows.length > 1 && (
                  <Button
                    variant="ghost"
                    color="red"
                    aria-label="remove link row"
                    onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="soft"
                color="gray"
                onClick={() => setRows((rs) => [...rs, { platform: 'other', url: '' }])}
              >
                + Add row
              </Button>
              <Button loading={busy} disabled={busy} onClick={finish}>
                Save, check & open
              </Button>
              <Button
                variant="ghost"
                color="gray"
                disabled={busy}
                onClick={() => personId != null && nav(`/persons/${personId}`)}
              >
                Skip check
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
