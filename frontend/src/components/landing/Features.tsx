'use client';

import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui';

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Multi-platform monitoring',
    description: 'Track changes across GitHub, Twitter, LinkedIn, Instagram, Facebook, and more from a single dashboard.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.381C7.673 5.04 7.225 4.96 6.824 5.12L4.029 4.2A4.032 4.032 0 002 8.038v.38a2 2 0 104 0V8.31c0 .7.4 1.3 1 1.6v.381a2 2 0 104 0v-.381c1.3-.07 2.57-.212 3.8-2.15" />
      </svg>
    ),
    title: 'Real-time alerts',
    description: 'Get instant notifications via email, Slack, or webhook when any monitored profile changes.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-5.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Smart change detection',
    description: 'AI-powered diff engine detects meaningful changes while filtering out noise like timestamps and view counts.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
      </svg>
    ),
    title: 'Historical timeline',
    description: 'View complete history of all changes with visual diffs. See exactly what changed and when.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Privacy-first',
    description: 'Your data never leaves your control. Run locally with PGLite or use your own Supabase instance.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: 'API & Webhooks',
    description: 'Build custom integrations with our REST API and real-time webhooks. Extend monitoring to your workflow.',
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8"
      aria-labelledby="features-title"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            What you get
          </span>
          <motion.h2
            id="features-title"
            className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-surface-950 dark:text-surface-0 leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Everything you need to{' '}
            <span className="gradient-text">stay informed</span>
          </motion.h2>
          <motion.p
            className="mt-6 text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Powerful features designed for developers and teams who need to stay on top of their digital presence.
          </motion.p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              className="group"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <Card variant="outlined" padding="lg" hover className="h-full">
                <CardContent className="h-full flex flex-col">
                  <motion.div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-white"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <motion.h3
                    className="mt-6 text-xl font-semibold text-surface-950 dark:text-surface-0"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    className="mt-3 text-surface-600 dark:text-surface-400 leading-relaxed flex-1"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    {feature.description}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Background decorative elements */}
      <motion.div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-500/5 blur-3xl -translate-x-1/2 translate-y-1/2"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-3xl translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />
    </section>
  );
}