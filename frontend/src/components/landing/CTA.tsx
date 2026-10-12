'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui';

export function CTA() {
  return (
    <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8" aria-labelledby="cta-title">
      <div className="mx-auto max-w-4xl text-center">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-brand-500/10 to-cyan-500/10 blur-3xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="grain-overlay" style={{ opacity: 0.02 }} />
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            Ready to start monitoring?
          </span>

          <motion.h2
            id="cta-title"
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-surface-950 dark:text-surface-0 leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Join thousands of developers who never miss an update
          </motion.h2>

          <motion.p
            className="mt-6 text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Start your free 14-day trial today. No credit card required. Cancel anytime.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button size="lg" href="/signup">
              Start free trial
            </Button>
            <Button size="lg" variant="outline" href="#features">
              Explore features
            </Button>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-surface-500 dark:text-surface-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="flex items-center gap-2">
              <motion.span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse" />
                <span className="relative h-2 w-2 rounded-full bg-green-500" />
              </motion.span>
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <motion.span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span className="relative h-2 w-2 rounded-full bg-green-500" />
              </motion.span>
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <motion.span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '1s' }} />
                <span className="relative h-2 w-2 rounded-full bg-green-500" />
              </motion.span>
              Cancel anytime
            </span>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-center">
              <motion.div
                className="text-4xl sm:text-5xl font-bold text-surface-950 dark:text-surface-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.6 }}
              >
                10,000+
              </motion.div>
              <div className="mt-1 text-sm text-surface-500 dark:text-surface-400">Developers monitoring</div>
            </div>
            <div className="text-center border-x border-surface-200 dark:border-surface-800">
              <motion.div
                className="text-4xl sm:text-5xl font-bold text-surface-950 dark:text-surface-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.7 }}
              >
                50M+
              </motion.div>
              <div className="mt-1 text-sm text-surface-500 dark:text-surface-400">Changes detected</div>
            </div>
            <div className="text-center">
              <motion.div
                className="text-4xl sm:text-5xl font-bold text-surface-950 dark:text-surface-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.8 }}
              >
                99.9%
              </motion.div>
              <div className="mt-1 text-sm text-surface-500 dark:text-surface-400">Uptime SLA</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}