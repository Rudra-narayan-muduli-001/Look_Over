import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const input =
    'w-full rounded-xl border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50';

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-xl font-bold text-slate-200">
        Add person <span className="text-sm font-normal text-slate-400">— step {step} of 2</span>
      </h1>
      {error && <p className="mb-3 text-sm text-[#F87171]">{error}</p>}
      {step === 1 ? (
        <div className="space-y-3 rounded-xl border border-white/10 bg-[#131A26] p-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className={input} />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            rows={3}
            className={input}
          />
          <button
            type="button"
            onClick={create}
            disabled={busy}
            className="rounded-xl bg-[#22D3EE] px-4 py-2 text-sm font-bold text-[#0B0F17] disabled:opacity-50"
          >
            {busy ? 'Creating…' : 'Continue'}
          </button>
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border border-white/10 bg-[#131A26] p-4">
          {rows.map((r, i) => (
            <div key={i} className="flex gap-2">
              <select
                value={r.platform}
                onChange={(e) =>
                  setRows((rs) => rs.map((x, j) => (j === i ? { ...x, platform: e.target.value as Platform } : x)))
                }
                className="rounded-xl border border-white/10 bg-[#0B0F17] px-2 py-2 text-sm text-slate-200"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                value={r.url}
                onChange={(e) =>
                  setRows((rs) => rs.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))
                }
                placeholder="https://…"
                className={input}
              />
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                  className="px-2 text-slate-400 hover:text-[#F87171]"
                  aria-label="remove link row"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRows((rs) => [...rs, { platform: 'other', url: '' }])}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
            >
              + Add row
            </button>
            <button
              type="button"
              onClick={finish}
              disabled={busy}
              className="rounded-xl bg-[#22D3EE] px-4 py-2 text-sm font-bold text-[#0B0F17] disabled:opacity-50"
            >
              {busy ? 'Checking…' : 'Save, check & open'}
            </button>
            <button
              type="button"
              onClick={() => personId != null && nav(`/persons/${personId}`)}
              disabled={busy}
              className="rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-slate-200"
            >
              Skip check
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
