// Lenis smooth scroll initialization
import Lenis from "lenis";

let lenis: Lenis | null = null;
let rafId: number;

export function initLenis(): Lenis {
  if (lenis) return lenis;

  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  function raf(time: number): void {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  return lenis;
}

export function destroyLenis(): void {
  cancelAnimationFrame(rafId);
  lenis?.destroy();
  lenis = null;
}

export { lenis };