'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  return (
    <section
      className={cn('relative min-h-[100dvh] flex items-center justify-center overflow-hidden', className)}
      aria-labelledby="hero-title"
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-transparent to-transparent dark:from-brand-950/50 dark:via-transparent" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-3xl"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="grain-overlay" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow */}
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="relative flex h-2 w-2">
              <motion.span
                className="absolute inset-0 rounded-full bg-brand-500 animate-pulse"
                initial={false}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="relative h-2 w-2 rounded-full bg-brand-500" />
            </span>
            <span>Now with real-time monitoring</span>
          </motion.span>

          {/* Headline */}
          <motion.h1
            id="hero-title"
            className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-surface-950 dark:text-surface-0 leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Monitor your digital presence{' '}
            <span className="gradient-text">effortlessly</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mt-6 text-lg sm:text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Get real-time alerts when your profiles change across GitHub, Twitter, LinkedIn, and more.
            Never miss an update again.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button size="lg" magnetic asChild>
              <Link to="/signup">Start monitoring free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="#features">See how it works</Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-surface-500 dark:text-surface-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cancel anytime
            </span>
          </motion.div>

          {/* Animated dashboard preview */}
          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-surface-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
        <motion.div
          className="h-6 w-1.5 rounded-full border-2 border-surface-300 dark:border-surface-600"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-surface-400 dark:bg-surface-500"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Browser chrome */}
      <div className="rounded-2xl bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 overflow-hidden shadow-2xl shadow-black/10">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <div className="ml-4 flex-1 text-center text-sm text-surface-500 dark:text-surface-400 font-mono">
            dashboard.eyesonyou.app
          </div>
        </div>
        <div className="p-6 space-y-4">
          {/* Header row */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              <div className="text-2xl font-bold text-surface-950 dark:text-surface-0">Dashboard</div>
              <div className="text-sm text-surface-500 dark:text-surface-400">Monitoring 3 profiles</div>
            </div>
            <Button size="sm" variant="secondary">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Profile
            </Button>
          </motion.div>

          {/* Profile cards */}
          <motion.div
            className="grid gap-4 md:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              { name: 'octocat', platform: 'GitHub', status: 'ok' as const, lastCheck: '2 min ago', changes: 3 },
              { name: 'vercel', platform: 'Twitter', status: 'ok' as const, lastCheck: '5 min ago', changes: 0 },
              { name: 'tailwindcss', platform: 'LinkedIn', status: 'warning' as const, lastCheck: '12 min ago', changes: 1 },
            ].map((profile, i) => (
              <motion.div
                key={profile.name}
                className="group p-4 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 transition-all duration-300 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-surface-950 dark:text-surface-0 truncate">{profile.name}</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                        {profile.platform}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                      <StatusDot status={profile.status} />
                      <span>Last checked {profile.lastCheck}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-surface-500 dark:text-surface-400">
                    <span className="font-medium text-brand-500">{profile.changes}</span> new changes
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Activity feed */}
          <motion.div
            className="border-t border-surface-200 dark:border-surface-800 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-surface-950 dark:text-surface-0">Recent Activity</div>
              <Button variant="ghost" size="sm">View all</Button>
            </div>
            <div className="space-y-3">
              {[
                { time: 'Just now', action: 'New commit pushed', target: 'octocat/hello-world', type: 'github' },
                { time: '5 min ago', action: 'Tweet posted', target: '@vercel', type: 'twitter' },
                { time: '12 min ago', action: 'Profile updated', target: 'tailwindcss', type: 'linkedin' },
              ].map((activity, i) => (
                <motion.div
                  key={activity.time}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface-50/50 dark:bg-surface-950/50 hover:bg-surface-100/50 dark:hover:bg-surface-800/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                >
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-purple-100 dark:bg-purple-900/30">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.112 2.674.112 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 11.797 24 7.297 24 12c0 6.627-5.373 12-12 12S0 18.627 0 12c0-6.628 5.373-12 12-12z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-950 dark:text-surface-0 truncate">{activity.action}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{activity.target}</p>
                  </div>
                  <time className="text-xs text-surface-400 dark:text-surface-500 whitespace-nowrap">{activity.time}</time>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating animation */}
      <motion.div
        className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-brand-500/20 to-cyan-500/20 blur-xl"
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-brand-500/20 blur-xl"
        animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  );
}

function StatusDot({ status }: { status: 'ok' | 'warning' | 'error' }) {
  const colors = {
    ok: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <motion.span
      className={`h-2 w-2 rounded-full ${colors[status]}`}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}