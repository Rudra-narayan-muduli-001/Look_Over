'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for personal use',
    features: [
      'Monitor up to 3 profiles',
      'Check every 6 hours',
      'Email notifications',
      '7-day change history',
      'Basic diff view',
      'Community support',
    ],
    cta: 'Start free',
    variant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For developers and creators',
    features: [
      'Monitor up to 20 profiles',
      'Check every 15 minutes',
      'Email, Slack, Discord, Webhooks',
      'Unlimited change history',
      'Advanced diff with syntax highlighting',
      'Priority email support',
      'API access',
      'Custom webhook payloads',
    ],
    cta: 'Start free trial',
    variant: 'primary' as const,
    popular: true,
  },
  {
    name: 'Team',
    price: '$39',
    period: '/month',
    description: 'For teams and agencies',
    features: [
      'Everything in Pro',
      'Monitor up to 100 profiles',
      'Check every 5 minutes',
      'Team workspace with roles',
      'Shared alert channels',
      'Audit logs',
      'SSO (SAML/OIDC)',
      'Dedicated support',
      'SLA guarantee',
    ],
    cta: 'Contact sales',
    variant: 'secondary' as const,
    popular: false,
  },
];

const faqs = [
  {
    question: 'Can I change plans later?',
    answer: 'Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately, downgrades at the end of your billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers for annual Team plans.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Yes, Pro comes with a 14-day free trial. No credit card required to start.',
  },
  {
    question: 'What happens when I exceed my profile limit?',
    answer: "You'll receive a notification and can upgrade immediately. Existing profiles continue monitoring.",
  },
  {
    question: 'Can I self-host?',
    answer: 'Yes! The core monitoring engine is open source. Run it locally with PGLite or your own Supabase instance.',
  },
];

export function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section
      id="pricing"
      className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8"
      aria-labelledby="pricing-title"
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
            Simple, transparent pricing
          </span>
          <motion.h2
            id="pricing-title"
            className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-surface-950 dark:text-surface-0 leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Choose the plan that's right for you
          </motion.h2>
          <motion.p
            className="mt-6 text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            All plans include a 14-day free trial. No credit card required.
          </motion.p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="text-sm font-medium text-surface-500">
            Monthly
          </span>
          <motion.button
            onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-100 dark:bg-surface-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200"
              animate={{ x: billing === 'yearly' ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          </motion.button>
          <span className="text-sm font-medium text-surface-500">
            Yearly
          </span>
          <motion.span
            className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <motion.span className="absolute inset-0 rounded-full bg-brand-500 animate-pulse" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-brand-500" />
            </span>
            Save 20%
          </motion.span>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          className="grid gap-8 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="relative"
            >
              <Card
                variant={plan.popular ? 'elevated' : 'outlined'}
                padding="lg"
                className="h-full flex flex-col"
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-brand-500 to-cyan-500"
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    Most Popular
                  </motion.div>
                )}

                <CardContent className="flex flex-col h-full">
                  <motion.div
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    <h3 className="text-xl font-semibold text-surface-950 dark:text-surface-0">{plan.name}</h3>
                    <p className="mt-1 text-surface-600 dark:text-surface-400">{plan.description}</p>
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-surface-950 dark:text-surface-0">
                        {plan.price}
                      </span>
                      <span className="text-surface-500 dark:text-surface-400">{plan.period}</span>
                    </div>
                    {billing === 'yearly' && (
                      <motion.p
                        className="mt-2 text-sm text-brand-600 dark:text-brand-400"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        {Math.round(parseInt(plan.price.replace('$', '')) * 12 * 0.8)}/year (save 20%)
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.ul
                    className="flex-1 space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    variants={{
                      hidden: { opacity: 0 },
                      show: { transition: { staggerChildren: 0.05 } },
                    }}
                  >
                    {plan.features.map((feature) => (
                      <motion.li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-surface-600 dark:text-surface-400"
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                        }}
                      >
                        <Check className="h-5 w-5 flex-shrink-0 text-brand-500" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </CardContent>

                <div className="pt-6">
                  <motion.button
                    className="w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <Button variant={plan.variant} className="w-full" size="lg">
                      {plan.cta}
                    </Button>
                  </motion.button>
                </div>
              </Card>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.div
        className="mt-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.h3 className="text-center text-2xl sm:text-3xl font-bold text-surface-950 dark:text-surface-0 mb-12">
          Frequently asked questions
        </motion.h3>
        <motion.div
          className="max-w-3xl mx-auto space-y-4"
          variants={{
            hidden: { opacity: 0 },
            show: { transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {faqs.map((faq) => (
            <motion.details
              key={faq.question}
              className="group bg-surface-50 dark:bg-surface-950 rounded-xl border border-surface-200 dark:border-surface-800 p-6 transition-all duration-300 hover:border-brand-500/50"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
            >
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-surface-950 dark:text-surface-0">
                {faq.question}
                <motion.svg
                  className="h-5 w-5 text-surface-400 group-open:rotate-180 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </summary>
              <motion.div
                className="mt-4 text-surface-600 dark:text-surface-400 leading-relaxed"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {faq.answer}
              </motion.div>
            </motion.details>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}