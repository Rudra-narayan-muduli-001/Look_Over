'use client';

import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { CTA } from '@/components/landing/CTA';

export function Landing() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
    </>
  );
}