import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Skeleton } from '@radix-ui/themes';
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
    <div className="flex min-h-[100dvh] flex-col sm:flex-row">
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

  if (gate.isPending)
    return (
      <div className="flex min-h-[100dvh] items-center justify-center p-4">
        <Skeleton width="220px" height="44px" />
      </div>
    );
  if (gate.isError && !gate.data)
    return (
      <div className="flex min-h-[100dvh] items-center justify-center p-4">
        <div className="w-full max-w-md">
          <EmptyState
            title="API is down"
            hint="Start the backend on http://localhost:8000, then retry."
            tone="danger"
            action={<Button onClick={() => gate.refetch()}>Retry</Button>}
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
