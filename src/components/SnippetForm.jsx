import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiChevronRight,
  FiClock,
  FiCode,
  FiClipboard,
  FiCommand,
  FiLink2,
  FiTrash2,
  FiX,
  FiZap,
} from 'react-icons/fi';
import LanguagePicker from './ui/LanguagePicker';
import ExpiryPicker from './ui/ExpiryPicker';
import LoadingSpinner from './LoadingSpinner';
import { createSnippet } from '../lib/api';
import { DEFAULT_LANGUAGE, detectLanguage, getExpiry, getLanguage, snippetFilename } from '../lib/languages';
import { IS_APPLE, cn, countLines, formatBytes, formatCount } from '../lib/utils';
import { useToast } from './ui/Toast';
import { useApiMode } from '../lib/useApiMode';

const EXAMPLES = [
  {
    label: 'JavaScript',
    value: 'javascript',
    code: `// Debounce — wait until the user stops typing
const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const search = debounce((query) => console.log('searching:', query), 400);
`,
  },
  {
    label: 'Python',
    value: 'python',
    code: `from dataclasses import dataclass


@dataclass
class Snippet:
    code: str
    language: str = "plaintext"
    expires_in: int | None = None

    @property
    def is_temporary(self) -> bool:
        return self.expires_in is not None
`,
  },
  {
    label: 'SQL',
    value: 'sql',
    code: `-- Most recent snippet per language
select language,
       count(*)                as snippets,
       max(created_at)         as last_seen
from   snippets
where  expires_at is null
   or  expires_at > now()
group  by language
order  by snippets desc
limit  10;
`,
  },
];

const FEATURES = [
  {
    icon: FiZap,
    title: 'Instant short links',
    body: 'Every snippet gets a five-character URL the moment you hit create — no accounts, no setup.',
    accent: 'from-brand-400/25 to-brand-600/5 text-brand-200',
  },
  {
    icon: FiClock,
    title: 'Self-destructing',
    body: 'Pick an expiry from five minutes to a week, or keep it forever. The database cleans itself up.',
    accent: 'from-aqua-400/25 to-aqua-600/5 text-aqua-300',
  },
  {
    icon: FiCode,
    title: 'Highlighted for free',
    body: '50+ languages are detected and highlighted automatically, with line numbers and wrapping.',
    accent: 'from-flare-400/25 to-flare-500/5 text-flare-400',
  },
  {
    icon: FiLink2,
    title: 'Raw endpoint',
    body: 'Append /raw to any link to get plain text — perfect for curl, CI jobs and quick pipes.',
    accent: 'from-brand-300/25 to-aqua-500/5 text-brand-100',
  },
];

export default function SnippetForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const { demo } = useApiMode();

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [languagePinned, setLanguagePinned] = useState(false);
  const [expireTime, setExpireTime] = useState('never');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const textareaRef = useRef(null);
  const errorRef = useRef(null);

  const lang = getLanguage(language);
  const lines = countLines(code);
  const expiry = getExpiry(expireTime);

  /* ---------------------------------------------------------------- *
   * Auto-growing editor: the textarea is always as tall as its
   * content, and the surrounding shell scrolls gutter + text together.
   * ---------------------------------------------------------------- */
  useLayoutEffect(() => {
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = 'auto';
    node.style.height = `${node.scrollHeight}px`;
  }, [code]);

  /* ---------------------------------------------------------------- *
   * Language auto-detection (only until the user picks one manually).
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (languagePinned) return;
    const detected = detectLanguage(code);
    if (detected && detected !== language) setLanguage(detected);
  }, [code, language, languagePinned]);

  // Keep the error message visible when it appears below the fold.
  useEffect(() => {
    if (!error) return;
    errorRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [error]);

  const handleLanguageChange = useCallback((value) => {
    setLanguage(value);
    setLanguagePinned(true);
  }, []);

  const insertExample = (example) => {
    setCode(example.code);
    setLanguage(example.value);
    setLanguagePinned(true);
    setError(null);
    textareaRef.current?.focus();
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        toast({ variant: 'info', title: 'Clipboard is empty', description: 'Copy some code first, then try again.' });
        return;
      }
      setCode(text);
      setError(null);
      toast({ variant: 'success', title: 'Pasted from clipboard', description: `${countLines(text)} lines ready to share.` });
      textareaRef.current?.focus();
    } catch {
      toast({
        variant: 'error',
        title: 'Clipboard blocked',
        description: 'Your browser needs permission — paste with ⌘V / Ctrl+V instead.',
      });
    }
  };

  const handleKeyDown = (event) => {
    // Tab inserts two spaces instead of leaving the editor.
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      const node = event.currentTarget;
      const { selectionStart, selectionEnd, value } = node;
      const next = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
      setCode(next);
      requestAnimationFrame(() => {
        node.selectionStart = selectionStart + 2;
        node.selectionEnd = selectionStart + 2;
      });
      return;
    }
    // ⌘/Ctrl + Enter submits.
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!code.trim()) {
      setError('Add some code first — the editor is empty.');
      toast({ variant: 'error', title: 'Nothing to share yet', description: 'Paste or type a snippet, then create the link.' });
      textareaRef.current?.focus();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await createSnippet({
        code,
        language,
        expireTime: expireTime === 'never' ? 0 : expireTime,
      });
      toast({
        variant: 'success',
        title: 'Link created',
        description: `/${data.uniqueCode} is live${expiry.minutes ? ` for ${expiry.label.toLowerCase()}` : ''}.`,
      });
      navigate(`/${data.uniqueCode}`);
    } catch (submitError) {
      const message = submitError?.message || 'Something went wrong while creating the snippet.';
      setError(message);
      toast({ variant: 'error', title: 'Could not create the link', description: message });
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(
    () => [
      { label: lines === 1 ? '1 line' : `${formatCount(lines)} lines` },
      { label: `${formatCount(code.length)} chars` },
      { label: formatBytes(code) },
    ],
    [code, lines],
  );

  const showEmptyState = code.length === 0 && !focused;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:pt-16">
      {/* ---------------------------------------------------------- *
       * Hero
       * ---------------------------------------------------------- */}
      <section className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="animate-fade-up">
          <span className="chip border-brand-400/25 bg-brand-500/10 text-brand-100">
            <FiZap className="text-brand-300" aria-hidden="true" />
            No sign-up · links expire when you say so
          </span>

          <h1 className="mt-6 font-display text-5xl font-semibold uppercase leading-[0.92] tracking-tight text-white text-balance sm:text-6xl lg:text-7xl">
            Paste it.
            <span className="text-gradient"> Share it.</span>
            <br />
            Ship it.
          </h1>

          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
            Drop code into the editor, pick a language and an expiry, and get a short link you can
            paste anywhere. Highlighted for 50+ languages, readable on any device, gone when it
            expires.
          </p>
        </div>

        <aside className="panel panel-sheen hidden animate-fade-up p-5 lg:block" style={{ animationDelay: '80ms' }}>
          <p className="text-2xs font-semibold uppercase tracking-[0.22em] text-ink-400">At a glance</p>
          <dl className="mt-4 space-y-4">
            {[
              { term: 'Languages', detail: '50+ grammars' },
              { term: 'Link length', detail: '5 characters' },
              { term: 'Accounts needed', detail: 'None — just paste' },
              { term: 'Shortcuts', detail: `${IS_APPLE ? '⌘' : 'Ctrl'} + ↵ to publish` },
            ].map((row) => (
              <div key={row.term} className="flex items-start justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
                <dt className="text-sm font-semibold text-white">{row.term}</dt>
                <dd className="text-right text-xs text-ink-300">{row.detail}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      {/* ---------------------------------------------------------- *
       * Demo-mode notice
       * ---------------------------------------------------------- */}
      {demo && (
        <div className="panel mt-8 flex items-start gap-3 border-brand-400/25 bg-brand-500/[0.07] p-4 animate-fade-in" role="status">
          <FiAlertTriangle className="mt-0.5 shrink-0 text-brand-200" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-brand-50/90">
            <span className="font-semibold text-white">Demo mode.</span> The API is unreachable from
            this preview, so snippets are saved in this browser only — links will not be shared
            with anyone else.
          </p>
        </div>
      )}

      {/* ---------------------------------------------------------- *
       * Composer
       * ---------------------------------------------------------- */}
      <form
        onSubmit={handleSubmit}
        className="panel panel-sheen mt-8 animate-fade-up overflow-visible"
        style={{ animationDelay: '120ms' }}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.07] px-3 py-2.5 sm:px-4">
          <span className="flex gap-1.5 pl-1" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-flare-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-300/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-aqua-400/70" />
          </span>
          <span className="ml-1 hidden truncate font-mono text-xs text-ink-300 sm:block">
            {snippetFilename(language)}
          </span>

          <div className="ml-auto flex w-full items-center gap-2 sm:w-auto">
            <div className="flex-1 sm:flex-none">
              <LanguagePicker value={language} onChange={handleLanguageChange} />
            </div>
            <div className="flex-1 sm:flex-none">
              <ExpiryPicker value={expireTime} onChange={setExpireTime} />
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="relative">
          <div className="flex max-h-[62vh] min-h-[16rem] overflow-auto transition-[min-height] duration-300 ease-snap sm:min-h-[22rem]">
            <div
              aria-hidden="true"
              className="shrink-0 select-none border-r border-white/[0.05] bg-ink-950/50 py-4 pl-4 pr-3 text-right font-mono text-[13.5px] leading-6 text-ink-600"
            >
              {Array.from({ length: Math.max(lines, 1) }, (_, index) => (
                <div key={index}>{index + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                if (error) setError(null);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
              wrap="off"
              className="code-area flex-1 overflow-hidden px-4"
              placeholder="Paste your code here…"
              aria-label="Code input"
            />
          </div>

          {/* Empty state */}
          {showEmptyState && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="pointer-events-auto flex flex-col items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl text-brand-200">
                  <FiCode aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-100">
                    Start typing, paste with{' '}
                    <span className="kbd">{IS_APPLE ? '⌘' : 'Ctrl'}</span>
                    <span className="kbd">V</span>, or try an example
                  </p>
                  <p className="mt-1 text-xs text-ink-400">
                    The language is detected automatically — change it any time.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {EXAMPLES.map((example) => (
                    <button
                      key={example.value}
                      type="button"
                      onClick={() => insertExample(example)}
                      className="btn-secondary px-3 py-1.5 text-xs"
                      aria-label={`Insert ${example.label} example`}
                    >
                      {example.label}
                      <FiChevronRight className="text-ink-400" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / actions */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/[0.07] bg-ink-900/40 px-3 py-3 sm:px-4">
          <div className="flex flex-wrap items-center gap-2 text-2xs text-ink-400">
            <span className="chip border-transparent bg-white/[0.04]">{stats[0].label}</span>
            <span className="chip border-transparent bg-white/[0.04]">{stats[1].label}</span>
            <span className="hidden chip border-transparent bg-white/[0.04] sm:inline-flex">{stats[2].label}</span>
            <span className="chip border-white/[0.08]" title="Detected language">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: lang.accent }} aria-hidden="true" />
              {lang.label}
              {!languagePinned && <span className="text-ink-500">· auto</span>}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1 text-2xs text-ink-500 lg:flex">
              <FiCommand aria-hidden="true" />
              <span className="kbd">↵</span>
              to publish
            </span>
            {code.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCode('');
                  setLanguagePinned(false);
                  setError(null);
                  textareaRef.current?.focus();
                }}
                className="btn-ghost px-2.5 py-2 text-xs"
              >
                <FiTrash2 aria-hidden="true" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            {typeof navigator !== 'undefined' && navigator.clipboard?.readText && (
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="btn-secondary px-2.5 py-2 text-xs"
                title="Paste from clipboard"
              >
                <FiClipboard aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Paste</span>
              </button>
            )}
            <button type="submit" className="btn-primary px-4 py-2 text-sm" disabled={loading || !code.trim()}>
              {loading ? <LoadingSpinner className="text-white" /> : <FiZap aria-hidden="true" />}
              {loading ? 'Creating…' : 'Create link'}
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div
            ref={errorRef}
            role="alert"
            className="flex items-start gap-3 border-t border-flare-500/30 bg-flare-500/[0.08] px-4 py-3 text-sm text-flare-100"
          >
            <FiAlertTriangle className="mt-0.5 shrink-0 text-flare-400" aria-hidden="true" />
            <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="icon-btn h-7 w-7 text-flare-200/80 hover:text-white"
              aria-label="Dismiss error"
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
        )}
      </form>

      {/* ---------------------------------------------------------- *
       * Feature grid
       * ---------------------------------------------------------- */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Why SnippetBin">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="panel group p-5 transition duration-300 ease-snap hover:-translate-y-0.5 hover:border-white/20 animate-fade-up"
              style={{ animationDelay: `${160 + index * 60}ms` }}
            >
              <span className={cn('grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br text-lg', feature.accent)}>
                <Icon aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-sm font-semibold text-white">{feature.title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-300">{feature.body}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
