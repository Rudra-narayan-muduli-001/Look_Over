'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui';

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Docs', href: '/docs' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [0, 1]);
  const backdropBlur = useTransform(scrollY, [0, 100], ['0px', '20px']);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-sticky transition-all duration-300"
      style={{ opacity, backdropFilter: backdropBlur }}
      initial={false}
      animate={{ y: 0 }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2" aria-label="Eyes on You Home">
              <motion.div
                className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center"
                initial={false}
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </motion.div>
              <span className="text-xl font-bold tracking-tight text-surface-950 dark:text-surface-0">
                Eyes on You
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <NavLink key={item.name} href={item.href} isActive={location.pathname === item.href || location.hash === item.href}>
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login" className="text-sm">Sign in</Link>
            </Button>
            <Button size="sm" onClick={() => setMobileMenuOpen(true)}>
              Get Started
            </Button>
            <button
              className="p-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ opacity: mobileMenuOpen ? 1 : 0, height: mobileMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden overflow-hidden bg-surface-0 dark:bg-surface-950 border-t border-surface-200 dark:border-surface-800"
      >
        <div className="px-4 py-4 space-y-3">
          {navigation.map((item) => (
            <NavLink key={item.name} href={item.href} className="block py-2">
              {item.name}
            </NavLink>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}

function NavLink({ href, children, className = '', isActive = false, ...props }: {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}) {
  return (
    <motion.a
      href={href}
      className={`text-sm font-medium transition-colors duration-200 hover:text-brand-500 dark:hover:text-brand-400 ${isActive ? 'text-brand-500 dark:text-brand-400' : 'text-surface-600 dark:text-surface-400'} ${className ? ' ' + className : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}