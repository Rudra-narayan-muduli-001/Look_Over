'use client';

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = Boolean(error);
    const hasHelper = Boolean(helperText) && !hasError;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5',
              required && 'after:content-["*"] after:text-error after:ml-0.5'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400 dark:text-surface-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : hasHelper ? helperId : undefined}
            className={cn(
              'w-full rounded-xl border bg-white dark:bg-surface-900',
              'text-surface-950 dark:text-surface-0 placeholder:text-surface-400 dark:placeholder:text-surface-500',
              'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : 'pl-4',
              rightIcon ? 'pr-10' : 'pr-4',
              'py-3',
              hasError
                ? 'border-error focus:ring-error/50'
                : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600',
              className
            )}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-surface-400 dark:text-surface-500">
              {rightIcon}
            </div>
          )}
          {hasError && (
            <span className="absolute -bottom-5 left-0 text-xs text-error" id={errorId}>
              {error}
            </span>
          )}
        </div>
        {hasHelper && !hasError && (
          <p id={helperId} className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
);

Input.displayName = 'Input';

// ============================================================================

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      id,
      disabled,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = Boolean(error);
    const hasHelper = Boolean(helperText) && !hasError;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5',
              required && 'after:content-["*"] after:text-error after:ml-0.5'
            )}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          rows={rows}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : hasHelper ? helperId : undefined}
          className={cn(
            'w-full rounded-xl border bg-white dark:bg-surface-900 p-4',
            'text-surface-950 dark:text-surface-0 placeholder:text-surface-400 dark:placeholder:text-surface-500',
            'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] resize-none',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            hasError
              ? 'border-error focus:ring-error/50'
              : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600',
            className
          )}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
        {hasError && (
          <p className="mt-1.5 text-xs text-error" id={errorId}>
            {error}
          </p>
        )}
        {hasHelper && !hasError && (
          <p id={helperId} className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
);

Textarea.displayName = 'Textarea';

// ============================================================================

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required, className = '', ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5',
        required && 'after:content-["*"] after:text-error after:ml-0.5',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
);

Label.displayName = 'Label';