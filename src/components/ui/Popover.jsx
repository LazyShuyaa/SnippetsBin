import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

/** Small uncontrolled/controlled disclosure helper. */
export function useDisclosure(initial = false) {
  const [open, setOpen] = useState(initial);
  const toggle = useCallback(() => setOpen((value) => !value), []);
  const close = useCallback(() => setOpen(false), []);
  const openMenu = useCallback(() => setOpen(true), []);
  return { open, setOpen, toggle, close, openMenu };
}

/**
 * Floating panel anchored to its trigger. Closes on outside click / Escape.
 */
export default function Popover({
  open,
  onClose,
  trigger,
  children,
  align = 'left',
  className,
  panelClassName,
  label,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) onClose?.();
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {trigger}
      {open && (
        <div
          role="dialog"
          aria-label={label}
          className={cn(
            'panel panel-sheen absolute z-50 mt-2 origin-top animate-pop-in overflow-hidden',
            align === 'right' ? 'right-0' : 'left-0',
            panelClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
