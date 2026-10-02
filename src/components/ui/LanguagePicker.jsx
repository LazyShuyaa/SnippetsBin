import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiCheck, FiChevronDown, FiSearch, FiTerminal } from 'react-icons/fi';
import { LANGUAGES, getLanguage } from '../../lib/languages';
import { cn } from '../../lib/utils';
import Popover, { useDisclosure } from './Popover';

const POPULAR = [
  'javascript',
  'typescript',
  'python',
  'html',
  'css',
  'json',
  'sql',
  'shell',
  'java',
  'go',
  'rust',
  'cpp',
  'csharp',
  'php',
  'yaml',
  'markdown',
];

const POPULAR_SET = new Set(POPULAR);

export default function LanguagePicker({ value, onChange }) {
  const { open, toggle, close } = useDisclosure();
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef(null);
  const selected = getLanguage(value);

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = needle
      ? LANGUAGES.filter(
          (lang) =>
            lang.label.toLowerCase().includes(needle) ||
            lang.value.includes(needle) ||
            lang.ext.toLowerCase().includes(needle.replace(/^\./, '')),
        )
      : LANGUAGES;

    if (needle) return [{ title: null, items: matches }];

    const popular = matches.filter((lang) => POPULAR_SET.has(lang.value));
    const rest = matches.filter((lang) => !POPULAR_SET.has(lang.value));
    return [
      { title: 'Popular', items: popular },
      { title: 'All languages', items: rest },
    ].filter((group) => group.items.length > 0);
  }, [query]);

  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);

  // Reset the highlight whenever the result set changes.
  useEffect(() => {
    setHighlight(0);
  }, [query]);

  // Focus the search field on open.
  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  // Keep the highlighted option in view.
  useEffect(() => {
    if (!open) return;
    const node = document.getElementById(`language-option-${highlight}`);
    node?.scrollIntoView({ block: 'nearest' });
  }, [highlight, open]);

  const select = (langValue) => {
    onChange?.(langValue);
    close();
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlight((index) => Math.min(index + 1, flat.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlight((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const option = flat[highlight];
      if (option) select(option.value);
    } else if (event.key === 'Home') {
      setHighlight(0);
    } else if (event.key === 'End') {
      setHighlight(flat.length - 1);
    }
  };

  return (
    <Popover
      open={open}
      onClose={close}
      label="Choose a language"
      panelClassName="w-[19rem] max-w-[calc(100vw-2rem)]"
      trigger={
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'btn-secondary w-full justify-between gap-2 sm:w-auto',
            open && 'border-brand-400/50 bg-white/[0.08]',
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="flex min-w-0 items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full ring-2 ring-white/10"
              style={{ backgroundColor: selected.accent }}
              aria-hidden="true"
            />
            <span className="truncate">{selected.label}</span>
          </span>
          <FiChevronDown
            className={cn('shrink-0 text-ink-400 transition-transform duration-200', open && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      }
    >
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-3 py-2.5">
        <FiSearch className="shrink-0 text-ink-400" aria-hidden="true" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search 50+ languages…"
          className="w-full bg-transparent text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none"
          aria-label="Search languages"
          aria-controls="language-listbox"
          aria-activedescendant={flat[highlight] ? `language-option-${highlight}` : undefined}
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-2xs font-semibold uppercase tracking-wide text-ink-400 hover:text-ink-100"
          >
            Clear
          </button>
        )}
      </div>

      <ul
        id="language-listbox"
        role="listbox"
        aria-label="Languages"
        className="max-h-[19rem] overflow-y-auto p-1.5"
        onMouseDown={(event) => event.preventDefault()}
      >
        {flat.length === 0 && (
          <li className="flex items-center gap-2 px-3 py-6 text-sm text-ink-400">
            <FiTerminal aria-hidden="true" />
            No language matches “{query}”.
          </li>
        )}

        {groups.map((group) => (
          <React.Fragment key={group.title || 'results'}>
            {group.title && (
              <li
                className="px-3 pb-1 pt-2 text-2xs font-semibold uppercase tracking-[0.16em] text-ink-500"
                role="presentation"
              >
                {group.title}
              </li>
            )}
            {group.items.map((lang) => {
              const index = flat.indexOf(lang);
              const isActive = index === highlight;
              const isSelected = lang.value === selected.value;
              return (
                <li
                  key={lang.value}
                  id={`language-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => select(lang.value)}
                  className={cn(
                    'group flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive ? 'bg-white/[0.08] text-white' : 'text-ink-200',
                  )}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: lang.accent }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 truncate">{lang.label}</span>
                  <span
                    className={cn(
                      'font-mono text-2xs',
                      isActive ? 'text-ink-400' : 'text-ink-500',
                    )}
                  >
                    .{lang.ext}
                  </span>
                  {isSelected && <FiCheck className="shrink-0 text-aqua-300" aria-hidden="true" />}
                </li>
              );
            })}
          </React.Fragment>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-2 border-t border-white/[0.07] bg-white/[0.02] px-3 py-2 text-2xs text-ink-400">
        <span>Auto-detected as you paste</span>
        <span className="flex items-center gap-1">
          <span className="kbd">↑</span>
          <span className="kbd">↓</span>
          <span className="kbd">↵</span>
        </span>
      </div>
    </Popover>
  );
}
