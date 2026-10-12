import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Theme } from '@radix-ui/themes';
import { useGSAP } from '@gsap/react';
import { lenis } from './lib/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';
import App from './App';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

function GSAPProvider({ children }: { children: React.ReactNode }) {
  useGSAP(() => {
    // Global GSAP defaults
    gsap.defaults({
      ease: 'expo.out',
      duration: 0.8,
    });

    // ScrollTrigger defaults
    ScrollTrigger.defaults({
      scroller: window,
      markers: false,
    });

    // Sync Lenis with ScrollTrigger
    lenis?.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }, { scope: { current: document } });

  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme
      appearance="dark"
      accentColor="cyan"
      grayColor="slate"
      radius="large"
      panelBackground="solid"
    >
      <QueryClientProvider client={queryClient}>
        <GSAPProvider>
          <App />
        </GSAPProvider>
      </QueryClientProvider>
    </Theme>
  </StrictMode>,
);