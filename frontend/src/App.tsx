import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { health } from './lib/api';
import { useAlerts } from './hooks/useAlerts';
import Sidebar from './components/Sidebar';
import EmptyState from './components/EmptyState';
import Dashboard from './pages/Dashboard';
import PersonDetail from './pages/PersonDetail';
import AddPerson from './pages/AddPerson';
import Alerts from './pages/Alerts';

function Shell() {
  const alerts = useAlerts();
  const total = alerts.data?.length ?? 0;
  return (
    <div className="flex min-h-screen flex-col bg-[#0B0F17] sm:flex-row">
      <Sidebar unseen={total} />
      <main className="flex-1 p-4 sm:p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/persons/:id" element={<PersonDetail />} />
          <Route path="/new" element={<AddPerson />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const gate = useQuery({
    queryKey: ['health'],
    queryFn: health,
    retry: 1,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  if (gate.isPending) return <p className="p-8 text-slate-400">Connecting to API…</p>;
  if (gate.isError && !gate.data)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F17] p-4">
        <div className="w-full max-w-md">
          <EmptyState
            title="API is down"
            hint="Start the backend on http://localhost:8000, then retry."
            action={
              <button
                type="button"
                onClick={() => gate.refetch()}
                className="rounded-xl bg-[#22D3EE] px-4 py-2 text-sm font-bold text-[#0B0F17]"
              >
                Retry
              </button>
            }
          />
        </div>
      </div>
    );

  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
