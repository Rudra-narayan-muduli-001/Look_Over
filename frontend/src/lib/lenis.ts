// Lenis smooth scroll initialization
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;
let rafId: number;

export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  function raf(time: number): void {
    lenisInstance?.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  return lenisInstance;
}

export function destroyLenis(): void {
  cancelAnimationFrame(rafId);
  lenisInstance?.destroy();
  lenisInstance = null;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export { lenisInstance as lenis };