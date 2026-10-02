import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiAlignLeft, FiCheck, FiCopy, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import PrismLight, { ensureGrammar, isGrammarAvailable } from '../../lib/prism';
import { codeTheme } from '../../lib/codeTheme';
import { getLanguage } from '../../lib/languages';
import { cn, copyText, downloadFile } from '../../lib/utils';

/**
 * Read-only, syntax highlighted code panel with a small toolbar:
 * file name, language badge, wrap toggle, fullscreen toggle and copy.
 */
export default function CodeBlock({
  code = '',
  language = 'plaintext',
  filename,
  actions = null,
  showToolbar = true,
  maxHeight = 'min(70vh, 720px)',
  expanded: expandedProp,
  onExpandedChange,
  className,
  footer = null,
}) {
  const [wrap, setWrap] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expandedInternal, setExpandedInternal] = useState(false);

  const isControlled = expandedProp !== undefined;
  const expanded = isControlled ? expandedProp : expandedInternal;

  const lang = useMemo(() => getLanguage(language), [language]);
  // The grammar may still be fetching — until it is registered we render
  // plain text at the exact same metrics, so nothing shifts.
  const [grammarReady, setGrammarReady] = useState(() => !isGrammarAvailable(lang.prism));
  const grammarExists = isGrammarAvailable(lang.prism);

  useEffect(() => {
    let active = true;
    if (!isGrammarAvailable(lang.prism)) {
      setGrammarReady(true);
      return undefined;
    }
    setGrammarReady(false);
    ensureGrammar(lang.prism).then((ok) => {
      if (active) setGrammarReady(ok);
    });
    return () => {
      active = false;
    };
  }, [lang.prism]);

  const highlightable = grammarReady && grammarExists;

  const setExpanded = useCallback(
    (next) => {
      if (!isControlled) setExpandedInternal(next);
      onExpandedChange?.(next);
    },
    [isControlled, onExpandedChange],
  );

  // Lock scroll + support Escape while in fullscreen mode.
  useEffect(() => {
    if (!expanded) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [expanded, setExpanded]);

  const handleCopy = useCallback(async () => {
    const ok = await copyText(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
    return ok;
  }, [code]);

  const handleDownload = useCallback(() => {
    downloadFile(
      filename || `snippet.${lang.ext}`,
      code,
      lang.prism === 'json' ? 'application/json' : 'text/plain;charset=utf-8',
    );
  }, [code, filename, lang]);

  // Keyboard shortcuts: C copy · W wrap · F fullscreen · N download.
  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (typing || window.getSelection()?.toString()) return;

      const key = event.key.toLowerCase();
      if (key === 'c') {
        event.preventDefault();
        handleCopy();
      } else if (key === 'w') {
        event.preventDefault();
        setWrap((value) => !value);
      } else if (key === 'f') {
        event.preventDefault();
        setExpanded(!expanded);
      } else if (key === 'n') {
        event.preventDefault();
        handleDownload();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleCopy, handleDownload, expanded, setExpanded]);

  return (
    <section
      className={cn(
        'code-surface animate-fade-up',
        expanded && 'fixed inset-0 z-[60] flex flex-col rounded-none border-0 bg-ink-950',
        className,
      )}
      aria-label="Snippet code"
    >
      {showToolbar && (
        <header className="flex flex-wrap items-center gap-2 border-b border-white/[0.07] bg-ink-900/70 px-3 py-2 backdrop-blur">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="flex gap-1.5 pl-1" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-flare-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-300/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-aqua-400/70" />
            </span>
            <span className="ml-2 truncate font-mono text-xs text-ink-300">
              {filename || `snippet.${lang.ext}`}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <span className="chip hidden sm:inline-flex" title={lang.label}>
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: lang.accent }}
                aria-hidden="true"
              />
              {lang.label}
            </span>
            {actions}
            <button
              type="button"
              onClick={() => setWrap((value) => !value)}
              className={cn('icon-btn h-8 w-8', wrap && 'icon-btn-active')}
              aria-pressed={wrap}
              title={wrap ? 'Disable line wrapping (W)' : 'Wrap long lines (W)'}
              aria-label="Toggle line wrapping"
            >
              <FiAlignLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="icon-btn hidden h-8 w-8 sm:inline-flex"
              title="Download file (N)"
              aria-label="Download file"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="icon-btn h-8 w-8"
              title={expanded ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
              aria-label={expanded ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {expanded ? <FiMinimize2 aria-hidden="true" /> : <FiMaximize2 aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="btn-secondary h-8 gap-1.5 px-2.5 py-0 text-xs"
              aria-label="Copy code"
              title="Copy code (C)"
            >
              {copied ? <FiCheck className="text-aqua-300" aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </header>
      )}

      <div
        data-wrap={wrap ? 'true' : 'false'}
        className={cn(
          'code-scroll overflow-auto px-4 py-4 text-[13.5px] leading-6 sm:px-5',
          expanded && 'flex-1 px-5 py-5',
        )}
        style={expanded ? undefined : { maxHeight }}
      >
        {highlightable ? (
          <PrismLight
            language={lang.prism}
            style={codeTheme}
            showLineNumbers
            // Long lines are wrapped by the line-number gutter + <pre> pair
            // (below), which keeps the numbers aligned — react-syntax-highlighter's
            // own wrapLongLines breaks the flex layout the gutter creates.
            wrapLines={wrap}
            lineProps={wrap ? { style: { display: 'block', whiteSpace: 'pre-wrap', wordBreak: 'break-word' } } : undefined}
            customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
            codeTagProps={{ className: 'font-mono' }}
          >
            {code}
          </PrismLight>
        ) : (
          <pre
            className={cn(
              'font-mono text-[13.5px] leading-6 text-ink-100',
              wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre',
            )}
          >
            {code}
          </pre>
        )}
      </div>

      {footer && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/[0.06] bg-ink-900/50 px-4 py-2 text-2xs text-ink-400">
          {footer}
        </div>
      )}
      {!grammarExists && (
        <div className="border-t border-white/[0.06] bg-ink-900/50 px-4 py-2 text-2xs text-ink-400">
          Plain text preview — no syntax grammar registered for “{lang.label}”.
        </div>
      )}
    </section>
  );
}
