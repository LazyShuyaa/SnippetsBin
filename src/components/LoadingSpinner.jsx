import React from 'react';
import { cn } from '../lib/utils';

/**
 * Inline spinner. Used for buttons and small loading affordances.
 */
export default function LoadingSpinner({ className, label = 'Loading…' }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)} role="status">
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
