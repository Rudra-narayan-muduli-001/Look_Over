import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  Button,
  Callout,
  Card,
  Code,
  Dialog,
  Heading,
  Select,
  Skeleton,
  Table,
  Tabs,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes';
import { usePerson } from '../hooks/usePerson';
import { useTimeline } from '../hooks/useTimeline';
import { usePosts } from '../hooks/usePosts';
import { useMarkSeen } from '../hooks/useAlerts';
import {
  addLink,
  deleteLink,
  deletePerson,
  manualSnapshot,
  updatePerson,
} from '../lib/api';
import type { Platform, ProfileLink } from '../lib/api';
import LinkRow from '../components/LinkRow';
import TimelineItem from '../components/TimelineItem';
import PostCard from '../components/PostCard';
import DiffBadge from '../components/DiffBadge';
import CheckNowButton from '../components/CheckNowButton';
import EmptyState from '../components/EmptyState';

const BLOCKED = new Set(['blocked', 'needs_login', 'rate_limited']);
const PLATFORMS = ['github', 'x', 'instagram', 'facebook', 'linkedin', 'other'] as Platform[];

function ManualPasteDialog({
  link,
  open,
  onOpenChange,
}: {
  link: ProfileLink | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async () => {
    if (!link) return;
    setBusy(true);
    setError('');
    try {
      const payload = JSON.parse(text) as {
        profile: Record<string, unknown>;
        posts?: Array<Record<string, unknown>>;
      };
      await manualSnapshot(link.id, payload);
      qc.invalidateQueries({ queryKey: ['timeline', link.person_id] });
      qc.invalidateQueries({ queryKey: ['posts', link.person_id] });
      qc.invalidateQueries({ queryKey: ['alerts'] });
      onOpenChange(false);
      setText('');
    } catch {
      setError('Invalid JSON or request failed. Expected {"profile": {...}, "posts": [...]}.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="600px">
        <Dialog.Title>Manual snapshot: {link?.platform}</Dialog.Title>
        <Dialog.Description size="2">
          Paste <Code>{'{"profile": {...}, "posts": [...]}'}</Code>; it goes through the same diff
          pipeline.
        </Dialog.Description>
        <TextArea
          mt="3"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='{"profile": {"display_name": "…", "bio": "…"}, "posts": []}'
          style={{ fontFamily: 'var(--code-font-family)' }}
        />
        {error && (
          <Callout.Root color="red" variant="soft" mt="2">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        <div className="mt-3 flex gap-2">
          <Button loading={busy} disabled={busy} onClick={submit}>
            Submit snapshot
          </Button>
          <Dialog.Close>
            <Button variant="ghost" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function SettingsTab({ personId, links }: { personId: number; links: ProfileLink[] }) {
  const nav = useNavigate();
  const qc = useQueryClient();
  const person = usePerson(personId);
  const [name, setName] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<Platform>('other');
  const [msg, setMsg] = useState('');
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['person', personId] });
    qc.invalidateQueries({ queryKey: ['persons'] });
  };
  const removePerson = async () => {
    await deletePerson(personId);
    qc.invalidateQueries({ queryKey: ['persons'] });
    nav('/');
  };
  return (
    <div className="space-y-4">
      {msg && (
        <Callout.Root color="red" variant="soft">
          <Callout.Text>{msg}</Callout.Text>
        </Callout.Root>
      )}
      <Card size="3">
        <div className="space-y-2">
          <Heading size="3">Profile</Heading>
          <TextField.Root
            aria-label="name"
            value={name ?? person.data?.name ?? ''}
            onChange={(e) => setName(e.target.value)}
          />
          <TextArea
            aria-label="notes"
            rows={2}
            value={notes ?? person.data?.notes ?? ''}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div>
            <Button
              variant="soft"
              size="2"
              onClick={async () => {
                try {
                  await updatePerson(personId, {
                    ...(name != null ? { name } : {}),
                    ...(notes != null ? { notes } : {}),
                  });
                  setName(null);
                  setNotes(null);
                  refresh();
                } catch {
                  setMsg('Save failed.');
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Card>
      <Card size="3">
        <div className="space-y-2">
          <Heading size="3">Links</Heading>
          {links.map((l) => (
            <div key={l.id} className="flex items-center gap-2">
              <div className="flex-1">
                <LinkRow link={l} />
              </div>
              <Button
                variant="ghost"
                color="gray"
                aria-label={`delete ${l.platform} link`}
                onClick={async () => {
                  await deleteLink(l.id);
                  refresh();
                }}
              >
                ✕
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Select.Root value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
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
              placeholder="https://…"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button
              variant="soft"
              size="2"
              onClick={async () => {
                if (!url.trim()) return;
                try {
                  await addLink(personId, { platform, url: url.trim() });
                  setUrl('');
                  refresh();
                } catch {
                  setMsg('Add link failed (422 = bad URL).');
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </Card>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red" variant="soft">
            Delete person
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Delete {person.data?.name}?</AlertDialog.Title>
          <AlertDialog.Description size="2">
            This removes their links, snapshots, posts and changes. It cannot be undone.
          </AlertDialog.Description>
          <div className="mt-4 flex justify-end gap-3">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={removePerson}>
                Delete
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
}

export default function PersonDetail() {
  const id = Number(useParams().id);
  const [tab, setTab] = useState('timeline');
  const [pasteFor, setPasteFor] = useState<ProfileLink | null>(null);
  const person = usePerson(id);
  const timeline = useTimeline(id);
  const posts = usePosts(id);
  const { markOne } = useMarkSeen();

  if (person.isPending)
    return (
      <div className="space-y-3">
        <Skeleton width="200px" height="28px" />
        <Skeleton width="100%" height="320px" />
      </div>
    );
  if (person.isError || !person.data) return <EmptyState title="Person not found" />;

  const p = person.data;
  const changes = [...(timeline.data?.changes ?? [])].sort((a, b) =>
    b.detected_at.localeCompare(a.detected_at)
  );
  const snapshots = [...(timeline.data?.snapshots ?? [])].sort((a, b) =>
    b.taken_at.localeCompare(a.taken_at)
  );
  const baseline = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  const blockedLinks = p.links.filter((l) => BLOCKED.has(l.last_status));

  return (
    <div>
      <div className="flex items-center gap-3">
        <Heading size="5">{p.name}</Heading>
        <CheckNowButton personId={id} />
      </div>
      {p.notes && (
        <Text as="p" size="2" color="gray" mt="1">
          {p.notes}
        </Text>
      )}

      <Tabs.Root value={tab} onValueChange={setTab} mt="4">
        <Tabs.List>
          <Tabs.Trigger value="timeline">Timeline</Tabs.Trigger>
          <Tabs.Trigger value="posts">Posts</Tabs.Trigger>
          <Tabs.Trigger value="checks">Checks</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="timeline">
          <div className="space-y-3">
            {timeline.isPending && (
              <>
                <Skeleton width="100%" height="76px" />
                <Skeleton width="100%" height="76px" />
              </>
            )}
            {timeline.data && changes.length === 0 && snapshots.length > 0 && (
              <EmptyState
                title="Baseline captured"
                hint="No diffs yet. Later checks will list changes here."
              />
            )}
            {timeline.data && snapshots.length === 0 && (
              <EmptyState title="No checks yet" hint="Run a check to capture the baseline." />
            )}
            {changes.map((c) => (
              <TimelineItem
                key={c.id}
                change={c}
                marking={markOne.isPending}
                onSeen={() => markOne.mutate(c.id)}
              />
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="posts">
          <div className="space-y-3">
            {posts.isPending && (
              <>
                <Skeleton width="100%" height="96px" />
                <Skeleton width="100%" height="96px" />
              </>
            )}
            {posts.data?.length === 0 && <EmptyState title="No posts yet" />}
            {posts.data?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="checks">
          <div className="space-y-3">
            {baseline && (
              <Card size="2" className="border-[var(--green-a6)]">
                <div className="flex items-center gap-2">
                  <DiffBadge type="field_change" field="baseline" />
                  <Text size="1" color="gray" className="ml-auto">
                    {format(new Date(baseline.taken_at), 'PPpp')} · {baseline.trigger}
                  </Text>
                </div>
                <Code mt="2" size="1" variant="ghost">
                  hash {baseline.hash.slice(0, 16)}…
                </Code>
              </Card>
            )}
            {snapshots.filter((s) => s !== baseline).length > 0 && (
              <Card size="2">
                <Table.Root size="1" variant="ghost">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>platform</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>trigger</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>taken</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {snapshots
                      .filter((s) => s !== baseline)
                      .map((s) => (
                        <Table.Row key={s.id}>
                          <Table.Cell>{s.platform}</Table.Cell>
                          <Table.Cell>{s.trigger}</Table.Cell>
                          <Table.Cell>{format(new Date(s.taken_at), 'PPpp')}</Table.Cell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table.Root>
              </Card>
            )}
            <div className="space-y-2">
              {p.links.map((l) => (
                <LinkRow key={l.id} link={l} />
              ))}
            </div>
            {blockedLinks.length > 0 && (
              <EmptyState
                title="A platform needs attention"
                hint="Blocked or login-walled. Paste a snapshot manually."
                tone="warn"
                action={
                  <div className="flex justify-center gap-2">
                    {blockedLinks.map((l) => (
                      <Button
                        key={l.id}
                        color="amber"
                        variant="soft"
                        size="2"
                        onClick={() => setPasteFor(l)}
                      >
                        Paste for {l.platform}
                      </Button>
                    ))}
                  </div>
                }
              />
            )}
          </div>
        </Tabs.Content>

        <Tabs.Content value="settings">
          <SettingsTab personId={id} links={p.links} />
        </Tabs.Content>
      </Tabs.Root>

      <ManualPasteDialog
        link={pasteFor}
        open={pasteFor != null}
        onOpenChange={(open) => !open && setPasteFor(null)}
      />
    </div>
  );
}
