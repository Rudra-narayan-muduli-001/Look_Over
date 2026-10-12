'use client';

import { motion, useReducedMotion, useMotionValue, useTransform, type HTMLMotionProps } from 'motion/react';
import { forwardRef } from 'react';

// ============================================================================
// Base Animated Components
// ============================================================================

interface FadeInProps extends HTMLMotionProps<'div'> {
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, delay = 0, direction = 'up', distance = 30, className = '', ...props }, ref) => {
    const reduce = useReducedMotion();

    const initial = {
      opacity: 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
    };

    return (
      <motion.div
        ref={ref}
        initial={reduce ? false : initial}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{
          duration: 0.7,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

FadeIn.displayName = 'FadeIn';

// ============================================================================

interface ScaleInProps extends HTMLMotionProps<'div'> {
  delay?: number;
  from?: number;
}

export const ScaleIn = forwardRef<HTMLDivElement, ScaleInProps>(
  ({ children, delay = 0, from = 0.95, className = '', ...props }, ref) => {
    const reduce = useReducedMotion();

    return (
      <motion.div
        ref={ref}
        initial={reduce ? false : { opacity: 0, scale: from }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay,
          ease: [0.68, -0.55, 0.265, 1.55],
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

ScaleIn.displayName = 'ScaleIn';

// ============================================================================

interface SlideInProps extends HTMLMotionProps<'div'> {
  delay?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
}

export const SlideIn = forwardRef<HTMLDivElement, SlideInProps>(
  ({ children, delay = 0, direction = 'left', distance = 50, className = '', ...props }, ref) => {
    const reduce = useReducedMotion();

    const initial = {
      opacity: 0,
      x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
      y: direction === 'up' ? -distance : direction === 'down' ? distance : 0,
    };

    return (
      <motion.div
        ref={ref}
        initial={reduce ? false : initial}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{
          duration: 0.7,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

SlideIn.displayName = 'SlideIn';

// ============================================================================

interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  stagger?: number;
  delayChildren?: number;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, stagger = 0.1, delayChildren = 0, className = '', ...props }, ref) => {
    const reduce = useReducedMotion();

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            transition: {
              staggerChildren: reduce ? 0 : stagger,
              delayChildren,
            },
          },
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerContainer.displayName = 'StaggerContainer';

// ============================================================================

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  delay?: number;
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, delay = 0, className = '', ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              delay,
              ease: [0.16, 1, 0.3, 1],
            },
          },
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerItem.displayName = 'StaggerItem';

// ============================================================================

interface ParallaxProps {
  speed?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Parallax = forwardRef<HTMLDivElement, ParallaxProps>(
  ({ children, speed = 0.5, className = '', style, ...props }, ref) => {
    const reduce = useReducedMotion();

    if (reduce) {
      return <div ref={ref} className={className} style={style} {...props}>{children}</div>;
    }

    return (
      <motion.div
        ref={ref}
        style={{ transformOrigin: 'center center', ...style } as React.CSSProperties}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Parallax.displayName = 'Parallax';

// ============================================================================

interface MagneticProps {
  strength?: number;
  children: React.ReactNode;
  className?: string;
  onMouseMove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  whileHover?: any;
  whileTap?: any;
  [key: string]: any;
}

export const Magnetic = forwardRef<HTMLButtonElement, MagneticProps>(
  ({ children, strength = 0.3, className = '', ...props }, ref) => {
    const reduce = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    useTransform([x, y], ([xVal, yVal]) => `translate(${xVal}px, ${yVal}px)`);

    if (reduce) {
      return (
        <button
          ref={ref}
          className={`${className} transition-transform duration-150 active:scale-[0.98]`}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        style={{ x, y } as unknown as React.CSSProperties}
        onMouseMove={(e: React.MouseEvent<HTMLButtonElement>) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          x.set((e.clientX - centerX) * strength);
          y.set((e.clientY - centerY) * strength);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        onMouseDown={() => {
          x.set(0);
          y.set(0);
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={className}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Magnetic.displayName = 'Magnetic';

// ============================================================================

export { motion, useReducedMotion, useMotionValue, useTransform } from 'motion/react';