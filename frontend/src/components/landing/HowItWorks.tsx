'use client';

import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui';
import { Check } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Connect your profiles',
    description: 'Add your GitHub, Twitter, LinkedIn, Instagram, or Facebook profiles. Just paste the URL — no OAuth required for public profiles.',
    details: [
      'Supports 6+ platforms out of the box',
      'Public profiles work without authentication',
      'Private profiles with optional token',
      'Bulk import from CSV',
    ],
  },
  {
    number: '02',
    title: 'Configure monitoring',
    description: 'Set check intervals, choose what changes matter, and configure alert channels. Get granular control over what triggers notifications.',
    details: [
      'Custom check intervals (15min - 24hrs)',
      'Filter by change type (bio, posts, followers)',
      'Email, Slack, Discord, webhook alerts',
      'Quiet hours & frequency caps',
    ],
  },
  {
    number: '03',
    title: 'Get real-time alerts',
    description: 'Receive instant notifications when changes are detected. View rich diffs showing exactly what changed with before/after comparisons.',
    details: [
      'Rich visual diffs with syntax highlighting',
      'Timeline view of all historical changes',
      'Batch notifications to reduce noise',
      'Mark as seen / dismiss actions',
    ],
  },
];

const integrations = [
  { name: 'GitHub', icon: 'github', color: 'from-purple-500 to-purple-600' },
  { name: 'Twitter/X', icon: 'twitter', color: 'from-sky-500 to-sky-600' },
  { name: 'LinkedIn', icon: 'linkedin', color: 'from-blue-500 to-blue-600' },
  { name: 'Instagram', icon: 'instagram', color: 'from-pink-500 via-purple-500 to-orange-500' },
  { name: 'Facebook', icon: 'facebook', color: 'from-blue-600 to-blue-700' },
  { name: 'Custom RSS', icon: 'rss', color: 'from-orange-500 to-orange-600' },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-950"
      aria-labelledby="how-it-works-title"
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
            How it works
          </span>
          <motion.h2
            id="how-it-works-title"
            className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-surface-950 dark:text-surface-0 leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Get started in{' '}
            <span className="gradient-text">three steps</span>
          </motion.h2>
          <motion.p
            className="mt-6 text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            From zero to monitoring in minutes. No complex setup, no credit card required.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid gap-8 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <Card variant="elevated" padding="lg" className="h-full">
                <CardContent className="flex flex-col h-full">
                  {/* Step number */}
                  <motion.div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white font-bold text-xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.15, type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    {step.number}
                  </motion.div>

                  <motion.h3
                    className="mt-6 text-xl font-semibold text-surface-950 dark:text-surface-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.1 }}
                  >
                    {step.title}
                  </motion.h3>

                  <motion.p
                    className="mt-3 text-surface-600 dark:text-surface-400 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.2 }}
                  >
                    {step.description}
                  </motion.p>

                  <motion.ul
                    className="mt-6 flex-1 space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                  >
                    {step.details.map((detail, i) => (
                      <motion.li
                        key={detail}
                        className="flex items-start gap-3 text-sm text-surface-600 dark:text-surface-400"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 + 0.3 + i * 0.05 }}
                      >
                        <Check className="h-5 w-5 flex-shrink-0 text-brand-500" />
                        <span>{detail}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </motion.div>

        {/* Supported platforms */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm font-medium">
              Supported platforms
            </span>
            <motion.h3
              className="mt-4 text-2xl sm:text-3xl font-bold text-surface-950 dark:text-surface-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Works with your favorite platforms
            </motion.h3>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              show: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {integrations.map((integration) => (
              <motion.button
                key={integration.name}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300"
                style={{ background: `linear-gradient(to right, ${integration.color.replace('from-', '').replace('to-', '').replace('via-', '')})` }}
                whileHover={{ y: -2, scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.98 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
                }}
              >
                <span className="capitalize">{integration.name}</span>
              </motion.button>
            ))}
          </motion.div>

          <motion.p
            className="mt-8 text-center text-surface-500 dark:text-surface-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Don't see your platform?{' '}
            <a href="#" className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 font-medium">
              Request an integration
            </a>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}