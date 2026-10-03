import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual snapshot — {link?.platform}</DialogTitle>
          <DialogDescription>
            Paste <code>{'{"profile": {...}, "posts": [...]}'}</code>; it goes through the same diff pipeline.
          </DialogDescription>
        </DialogHeader>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder='{"profile": {"display_name": "…", "bio": "…"}, "posts": []}'
          className="mt-3 w-full rounded-xl border border-white/10 bg-[#0B0F17] px-3 py-2 font-mono text-xs text-slate-200"
        />
        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
        <div className="mt-3 flex gap-2">
          <Button onClick={submit} disabled={busy}>
            {busy ? 'Saving…' : 'Submit snapshot'}
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
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
  return (
    <div className="space-y-4">
      {msg && <p className="text-sm text-danger">{msg}</p>}
      <Card>
        <CardContent className="space-y-2 p-4">
          <h2 className="text-sm font-semibold">Profile</h2>
          <Input
            value={name ?? person.data?.name ?? ''}
            onChange={(e) => setName(e.target.value)}
            aria-label="name"
          />
          <textarea
            value={notes ?? person.data?.notes ?? ''}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            aria-label="notes"
            className="w-full rounded-xl border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-slate-200"
          />
          <Button
            variant="secondary"
            size="sm"
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
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-2 p-4">
          <h2 className="text-sm font-semibold">Links</h2>
          {links.map((l) => (
            <div key={l.id} className="flex items-center gap-2">
              <div className="flex-1">
                <LinkRow link={l} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await deleteLink(l.id);
                  refresh();
                }}
                aria-label={`delete ${l.platform} link`}
              >
                ✕
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
            <Button
              variant="secondary"
              size="sm"
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
        </CardContent>
      </Card>
      <Button
        variant="destructive"
        onClick={async () => {
          if (!window.confirm(`Delete ${person.data?.name}?`)) return;
          await deletePerson(personId);
          qc.invalidateQueries({ queryKey: ['persons'] });
          nav('/');
        }}
      >
        Delete person
      </Button>
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

  if (person.isPending) return <p className="text-slate-400">Loading…</p>;
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
        <h1 className="text-xl font-bold">{p.name}</h1>
        <CheckNowButton personId={id} />
      </div>
      {p.notes && <p className="mt-1 text-sm text-slate-400">{p.notes}</p>}

      <Tabs value={tab} onValueChange={setTab} className="mt-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="checks">Checks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <div className="space-y-3">
            {timeline.isPending && <p className="text-slate-400">Loading timeline…</p>}
            {timeline.data && changes.length === 0 && snapshots.length > 0 && (
              <EmptyState title="Baseline captured" hint="No diffs yet — later checks will list changes here." />
            )}
            {timeline.data && snapshots.length === 0 && (
              <EmptyState title="No checks yet" hint="Run a check to capture the baseline." />
            )}
            {changes.map((c) => (
              <TimelineItem key={c.id} change={c} marking={markOne.isPending} onSeen={() => markOne.mutate(c.id)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="posts">
          <div className="space-y-3">
            {posts.isPending && <p className="text-slate-400">Loading posts…</p>}
            {posts.data?.length === 0 && <EmptyState title="No posts yet" />}
            {posts.data?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="checks">
          <div className="space-y-3">
            {baseline && (
              <Card className="border-success/40">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <DiffBadge type="field_change" field="baseline" />
                    <span className="ml-auto text-xs text-slate-400">
                      {format(new Date(baseline.taken_at), 'PPpp')} · {baseline.trigger}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-xs text-slate-400">hash {baseline.hash.slice(0, 16)}…</p>
                </CardContent>
              </Card>
            )}
            {snapshots
              .filter((s) => s !== baseline)
              .map((s) => (
                <Card key={s.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span>{s.platform}</span>
                      <span className="ml-auto text-xs text-slate-400">
                        {format(new Date(s.taken_at), 'PPpp')} · {s.trigger}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            <div className="space-y-2">
              {p.links.map((l) => (
                <LinkRow key={l.id} link={l} />
              ))}
            </div>
            {blockedLinks.length > 0 && (
              <EmptyState
                title="A platform needs attention"
                hint="Blocked or login-walled — paste a snapshot manually."
                action={
                  <div className="flex justify-center gap-2">
                    {blockedLinks.map((l) => (
                      <Button key={l.id} variant="warn" size="sm" onClick={() => setPasteFor(l)}>
                        Paste for {l.platform}
                      </Button>
                    ))}
                  </div>
                }
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab personId={id} links={p.links} />
        </TabsContent>
      </Tabs>

      <ManualPasteDialog link={pasteFor} open={pasteFor != null} onOpenChange={(open) => !open && setPasteFor(null)} />
    </div>
  );
}
