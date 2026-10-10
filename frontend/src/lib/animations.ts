import { gsap } from 'gsap';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function staggerEntrance(
  selector: string,
  options: {
    y?: number;
    opacity?: number;
    duration?: number;
    stagger?: number;
    ease?: string;
    from?: 'start' | 'center' | 'end';
  } = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(selector, { opacity: 1, y: 0, scale: 1 });
    return Promise.resolve();
  }
  const {
    y = 8,
    opacity = 0,
    duration = 0.3,
    stagger = 0.03,
    ease = 'power1.out',
    from = 'start',
  } = options;

  return gsap
    .from(selector, {
      opacity,
      y,
      duration,
      stagger: { each: stagger, from },
      ease,
      clearProps: 'all',
    })
    .promise();
}

export function fadeIn(
  selector: string,
  options: { duration?: number; delay?: number; ease?: string } = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(selector, { opacity: 1 });
    return Promise.resolve();
  }
  const { duration = 0.2, delay = 0, ease = 'power1.out' } = options;

  return gsap
    .from(selector, { opacity: 0, duration, delay, ease, clearProps: 'all' })
    .promise();
}

export function slideIn(
  selector: string,
  options: {
    direction?: 'up' | 'down' | 'left' | 'right';
    duration?: number;
    delay?: number;
    ease?: string;
  } = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(selector, { opacity: 1, x: 0, y: 0 });
    return Promise.resolve();
  }
  const { direction = 'up', duration = 0.3, delay = 0, ease = 'power2.out' } = options;
  const x = direction === 'left' ? -20 : direction === 'right' ? 20 : 0;
  const y = direction === 'up' ? 20 : direction === 'down' ? -20 : 0;

  return gsap
    .from(selector, { opacity: 0, x, y, duration, delay, ease, clearProps: 'all' })
    .promise();
}

export function scaleIn(
  selector: string,
  options: { duration?: number; delay?: number; ease?: string; from?: number } = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(selector, { opacity: 1, scale: 1 });
    return Promise.resolve();
  }
  const { duration = 0.2, delay = 0, ease = 'back.out(1.4)', from = 0.92 } = options;

  return gsap
    .from(selector, { opacity: 0, scale: from, duration, delay, ease, clearProps: 'all' })
    .promise();
}

export function modalEntrance(
  overlaySelector: string,
  contentSelector: string
) {
  if (prefersReducedMotion()) {
    gsap.set([overlaySelector, contentSelector], { opacity: 1, scale: 1, y: 0 });
    return Promise.resolve();
  }
  const tl = gsap.timeline();
  tl.from(overlaySelector, { opacity: 0, duration: 0.15, ease: 'power1.out' })
    .from(
      contentSelector,
      { opacity: 0, scale: 0.95, y: 8, duration: 0.2, ease: 'back.out(1.4)' },
      '-=0.1'
    );
  return tl.promise();
}

export function modalExit(
  overlaySelector: string,
  contentSelector: string
) {
  if (prefersReducedMotion()) {
    gsap.set([overlaySelector, contentSelector], { opacity: 0 });
    return Promise.resolve();
  }
  const tl = gsap.timeline();
  tl.to(contentSelector, { opacity: 0, scale: 0.95, y: -8, duration: 0.15, ease: 'power1.in' })
    .to(overlaySelector, { opacity: 0, duration: 0.1, ease: 'power1.in' }, '-=0.1');
  return tl.promise();
}

export function toastEntrance(selector: string) {
  if (prefersReducedMotion()) {
    gsap.set(selector, { opacity: 1, x: 0 });
    return Promise.resolve();
  }
  return gsap
    .from(selector, { opacity: 0, x: 30, duration: 0.3, ease: 'back.out(1.4)', clearProps: 'all' })
    .promise();
}

export function badgePulse(selector: string) {
  if (prefersReducedMotion()) return Promise.resolve();
  return gsap
    .to(selector, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.out' })
    .promise();
}

export function cardHover(selector: string, isEnter: boolean) {
  if (prefersReducedMotion()) return;
  gsap.to(selector, {
    y: isEnter ? -2 : 0,
    boxShadow: isEnter ? '0 12px 24px -8px rgba(0,0,0,0.3)' : 'none',
    duration: 0.15,
    ease: 'power1.out',
  });
}

export function buttonPress(selector: string, isPress: boolean) {
  if (prefersReducedMotion()) return;
  gsap.to(selector, {
    scale: isPress ? 0.97 : 1,
    duration: isPress ? 0.08 : 0.12,
    ease: 'power1.out',
  });
}