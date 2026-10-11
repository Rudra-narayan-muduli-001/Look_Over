import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { lenis } from './lenis';

const l = lenis;
if (l) {
  ScrollTrigger.defaults({ scroller: l.rootElement });
  l.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => l.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}