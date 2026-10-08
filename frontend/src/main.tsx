import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './index.css';
import App from './App.tsx';

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme
      appearance="dark"
      accentColor="cyan"
      grayColor="slate"
      radius="large"
      panelBackground="solid"
    >
      <QueryClientProvider client={qc}>
        <App />
      </QueryClientProvider>
    </Theme>
  </StrictMode>,
);
