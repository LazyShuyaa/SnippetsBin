import React, { useEffect } from 'react';
import { FiCheck, FiChevronDown, FiClock } from 'react-icons/fi';
import { EXPIRY_OPTIONS, getExpiry } from '../../lib/languages';
import { cn } from '../../lib/utils';
import Popover, { useDisclosure } from './Popover';

export default function ExpiryPicker({ value, onChange }) {
  const { open, toggle, close, setOpen } = useDisclosure();
  const selected = getExpiry(value);

  const select = (nextValue) => {
    onChange?.(nextValue);
    close();
  };

  // "E" focuses the expiry control, "C"/"W"/"F"/"N" are handled by CodeBlock.
  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (typing || event.key.toLowerCase() !== 'e') return;
      event.preventDefault();
      setOpen(true);
      setTimeout(() => document.getElementById('expiry-option-selected')?.focus(), 30);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  return (
    <Popover
      open={open}
      onClose={close}
      label="Choose when the link expires"
      panelClassName="w-[16.5rem] max-w-[calc(100vw-2rem)]"
      trigger={
        <button
          type="button"
          onClick={toggle}
          title="Link expiry (E)"
          className={cn(
            'btn-secondary w-full justify-between gap-2 sm:w-auto',
            open && 'border-brand-400/50 bg-white/[0.08]',
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2">
            <FiClock className="text-ink-400" aria-hidden="true" />
            <span className="truncate">{selected.label}</span>
          </span>
          <FiChevronDown
            className={cn('shrink-0 text-ink-400 transition-transform duration-200', open && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      }
    >
      <ul
        role="listbox"
        aria-label="Expiry options"
        className="p-1.5"
        onKeyDown={(event) => {
          // Arrow keys move between options, Enter/Space selects.
          if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const options = [...event.currentTarget.querySelectorAll('[role="option"]')];
          const currentIndex = options.indexOf(document.activeElement);
          let nextIndex = currentIndex;
          if (event.key === 'ArrowDown') nextIndex = Math.min(currentIndex + 1, options.length - 1);
          if (event.key === 'ArrowUp') nextIndex = Math.max(currentIndex - 1, 0);
          if (event.key === 'Home') nextIndex = 0;
          if (event.key === 'End') nextIndex = options.length - 1;
          options[nextIndex]?.focus();
        }}
      >
        {EXPIRY_OPTIONS.map((option) => {
          const isSelected = option.value === selected.value;
          return (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                id={isSelected ? 'expiry-option-selected' : undefined}
                aria-selected={isSelected}
                onClick={() => select(option.value)}
                className={cn(
                  'menu-item w-full justify-between',
                  isSelected && 'bg-white/[0.06] text-white',
                )}
              >
                <span className="flex items-center gap-2">
                  {option.label}
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-2xs text-ink-500">{option.short}</span>
                  {isSelected && <FiCheck className="text-aqua-300" aria-hidden="true" />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-white/[0.07] bg-white/[0.02] px-3 py-2 text-2xs text-ink-400">
        Expired snippets are deleted automatically — no cleanup needed.
      </div>
    </Popover>
  );
}
