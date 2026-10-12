'use client';

import { forwardRef, type ButtonHTMLAttributes, type Ref } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  magnetic?: boolean;
  asChild?: boolean;
  href?: string;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      magnetic = false,
      asChild = false,
      href,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const reduce = useReducedMotion();
    const isDisabled = disabled || loading;

    const baseStyles = `
      inline-flex items-center justify-center gap-2 font-medium rounded-xl
      transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98]
    `;

    const variants = {
      primary: `
        bg-brand-500 text-white hover:bg-brand-600
        shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40
        dark:shadow-brand-500/40 dark:hover:shadow-brand-500/50
      `,
      secondary: `
        bg-surface-100 text-surface-950 hover:bg-surface-200
        dark:bg-surface-800 dark:text-surface-0 dark:hover:bg-surface-700
        border border-surface-200 dark:border-surface-700
      `,
      outline: `
        bg-transparent text-surface-700 hover:bg-surface-100
        dark:text-surface-300 dark:hover:bg-surface-800
        border-2 border-surface-300 dark:border-surface-600
      `,
      ghost: `
        bg-transparent text-surface-700 hover:bg-surface-100
        dark:text-surface-300 dark:hover:bg-surface-800
      `,
      link: `
        bg-transparent text-brand-500 hover:text-brand-600 hover:underline
        dark:text-brand-400 dark:hover:text-brand-300
        p-0
      `,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-base gap-2',
      lg: 'px-7 py-3.5 text-lg gap-2.5',
      xl: 'px-9 py-4.5 text-xl gap-3',
    };

    const width = fullWidth ? 'w-full' : '';

    const IconWrapper = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
      <span className={cn('flex items-center justify-center', className)}>{children}</span>
    );

    const spinner = (
      <motion.svg
        className="h-5 w-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        initial={false}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </motion.svg>
    );

    const commonProps = {
      disabled: isDisabled,
      className: cn(baseStyles, variants[variant], sizes[size], width, className),
      whileHover: loading || reduce ? undefined : { scale: 1.02 },
      whileTap: { scale: 0.98 },
    } as const;

    // Magnetic button (only for button, not links)
    if (magnetic && !reduce && !href && !asChild) {
      return (
        <motion.button
          ref={ref as Ref<HTMLButtonElement>}
          {...commonProps}
          {...(props as HTMLMotionProps<'button'>)}
        >
          {loading ? spinner : leftIcon ? <IconWrapper>{leftIcon}</IconWrapper> : null}
          {children}
          {rightIcon && !loading && <IconWrapper>{rightIcon}</IconWrapper>}
        </motion.button>
      );
    }

    // Link button (with href or asChild)
    if (href || asChild) {
      const linkRef = ref as Ref<HTMLAnchorElement>;
      return (
        <motion.a
          ref={linkRef}
          {...(asChild ? {} : { href: href || '#' })}
          {...commonProps}
          {...(props as HTMLMotionProps<'a'>)}
        >
          {loading ? spinner : leftIcon ? <IconWrapper>{leftIcon}</IconWrapper> : null}
          {children}
          {rightIcon && !loading && <IconWrapper>{rightIcon}</IconWrapper>}
        </motion.a>
      );
    }

    // Regular button
    const buttonRef = ref as Ref<HTMLButtonElement>;
    return (
      <motion.button
        ref={buttonRef}
        {...commonProps}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {loading ? spinner : leftIcon ? <IconWrapper>{leftIcon}</IconWrapper> : null}
        {children}
        {rightIcon && !loading && <IconWrapper>{rightIcon}</IconWrapper>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// ============================================================================
// Icon Button
// ============================================================================

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, variant = 'ghost', size = 'md', 'aria-label': ariaLabel, className = '', ...props }, ref) => {
    const reduce = useReducedMotion();

    const sizes = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-all duration-200',
          sizes[size],
          className
        )}
        aria-label={ariaLabel}
        whileHover={reduce ? undefined : { scale: 1.1 }}
        whileTap={reduce ? undefined : { scale: 0.95 }}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {children}
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { Button };