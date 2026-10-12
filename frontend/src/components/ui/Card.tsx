'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      hover = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const reduce = useReducedMotion();

    const variants = {
      default: `
        bg-white dark:bg-surface-900
        border border-surface-200 dark:border-surface-800
        shadow-sm
      `,
      elevated: `
        bg-white dark:bg-surface-900
        shadow-xl shadow-black/5 dark:shadow-black/20
        border-none
      `,
      outlined: `
        bg-transparent
        border-2 border-surface-200 dark:border-surface-700
      `,
      glass: `
        bg-white/10 dark:bg-surface-950/60
        backdrop-blur-xl
        border border-white/20 dark:border-white/10
      `,
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    const baseStyles = 'rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]';

    const hoverStyles = hover
      ? `
        hover:shadow-xl hover:shadow-brand-500/10 dark:hover:shadow-brand-500/20
        hover:-translate-y-1
        hover:border-brand-500/30 dark:hover:border-brand-500/50
      `
      : '';

    const cardClassName = cn(baseStyles, variants[variant], paddings[padding], hoverStyles, className);

    // Use regular div with CSS hover effects instead of motion.div to avoid type issues
    if (!hover || reduce) {
      return (
        <div
          ref={ref}
          className={cardClassName}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={cardClassName}
        whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
        {...(props as HTMLMotionProps<'div'>)}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// ============================================================================
// Card Compound Components
// ============================================================================

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props} />
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold tracking-tight text-surface-950 dark:text-surface-0', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p
      ref={ref}
      className={cn('mt-1 text-surface-600 dark:text-surface-400', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-4 flex items-center gap-2', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';