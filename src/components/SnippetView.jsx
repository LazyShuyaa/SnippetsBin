import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiCopy,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiGithub,
  FiHash,
  FiLink2,
  FiPlus,
  FiRefreshCw,
  FiShare2,
  FiTerminal,
  FiZap,
} from 'react-icons/fi';
import CodeBlock from './code/CodeBlock';
import DropdownMenu from './DropdownMenu';
import SnippetSkeleton from './Skeleton';
import { getSnippet, NotFoundError } from '../lib/api';
import { getLanguage, snippetFilename } from '../lib/languages';
import {
  cn,
  copyText,
  countLines,
  downloadFile,
  formatBytes,
  formatCount,
  formatDateTime,
  timeAgo,
  timeUntil,
} from '../lib/utils';
import { useToast } from './ui/Toast';
import { useApiMode } from '../lib/useApiMode';

/* ------------------------------------------------------------------ *
 * Small building blocks
 * ------------------------------------------------------------------ */
function MetaRow({ icon: Icon, label, children, mono }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-2.5 last:border-0 last:pb-0">
      <dt className="flex items-center gap-2 text-xs text-ink-400">
        <Icon aria-hidden="true" />
        {label}
      </dt>
      <dd className={cn('truncate text-right text-xs font-medium text-ink-100', mono && 'font-mono')}>{children}</dd>
    </div>
  );
}

function CopyButton({ value, label = 'Copy', icon: Icon = FiCopy, className, toastTitle, toastBody }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const ok = await copyText(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      toast({ variant: 'success', title: toastTitle || 'Copied to clipboard', description: toastBody });
    } else {
      toast({ variant: 'error', title: 'Copy failed', description: 'Your browser blocked clipboard access.' });
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className} aria-live="polite">
      {copied ? <FiCheck className="text-aqua-300" aria-hidden="true" /> : <Icon aria-hidden="true" />}
      {copied ? 'Copied' : label}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Errors
 * ------------------------------------------------------------------ */
function ErrorPanel({ error, onRetry }) {
  const notFound = error instanceof NotFoundError;
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center animate-fade-up">
      <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-3xl text-brand-200">
        {notFound ? <FiAlertTriangle aria-hidden="true" /> : <FiRefreshCw aria-hidden="true" />}
      </span>
      <h1 className="mt-6 font-display text-4xl font-semibold uppercase tracking-tight text-white">
        {notFound ? 'Snippet not found' : 'Something broke'}
      </h1>
      <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-300">
        {notFound
          ? 'This link never existed, or the snippet expired and was cleaned up. Expired snippets cannot be recovered — paste it again to get a fresh link.'
          : error?.message || 'We could not load this snippet. Check your connection and try again.'}
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="btn-primary px-4 py-2.5">
          <FiPlus aria-hidden="true" />
          New snippet
        </Link>
        {!notFound && (
          <button type="button" onClick={onRetry} className="btn-secondary px-4 py-2.5">
            <FiRefreshCw aria-hidden="true" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Main view
 * ------------------------------------------------------------------ */
export default function SnippetView() {
  const { uniqueCode } = useParams();
  const toast = useToast();
  const { demo } = useApiMode();

  const [snippet, setSnippet] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [countdown, setCountdown] = useState(null);

  /* Fetch ---------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getSnippet(uniqueCode)
      .then((data) => {
        if (cancelled) return;
        setSnippet(data);
      })
      .catch((fetchError) => {
        if (cancelled) return;
        setSnippet(null);
        setError(fetchError);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [uniqueCode, reloadKey]);

  /* Document metadata --------------------------------------------- */
  useEffect(() => {
    if (!snippet) return undefined;
    const lang = getLanguage(snippet.language);
    document.title = `${uniqueCode} · ${lang.label} snippet — SnippetBin`;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    const previous = meta.getAttribute('content');
    meta.setAttribute(
      'content',
      `${lang.label} snippet shared with SnippetBin — ${countLines(snippet.code)} lines, ${formatBytes(snippet.code)}.`,
    );

    return () => {
      document.title = 'SnippetBin — Paste, share, and ship code';
      if (previous) meta.setAttribute('content', previous);
    };
  }, [snippet, uniqueCode]);

  /* Live countdown ------------------------------------------------ */
  useEffect(() => {
    if (!snippet?.expiresAt) {
      setCountdown(null);
      return undefined;
    }
    const tick = () => setCountdown(timeUntil(snippet.expiresAt));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [snippet]);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined' || !uniqueCode) return '';
    return `${window.location.origin}/${uniqueCode}`;
  }, [uniqueCode]);

  const rawUrl = useMemo(() => {
    if (typeof window === 'undefined' || !uniqueCode) return '';
    return `${window.location.origin}/raw/${uniqueCode}`;
  }, [uniqueCode]);

  const lang = getLanguage(snippet?.language);
  const filename = snippetFilename(snippet?.language, uniqueCode);

  const handleShare = useCallback(async () => {
    if (!snippet) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${lang.label} snippet`, text: 'Code snippet shared with SnippetBin', url: shareUrl });
        return;
      } catch {
        /* user cancelled or share failed — fall back to copying */
      }
    }
    const ok = await copyText(shareUrl);
    toast(
      ok
        ? { variant: 'success', title: 'Link copied', description: 'Share it anywhere you like.' }
        : { variant: 'error', title: 'Copy failed', description: 'Clipboard access was blocked.' },
    );
  }, [snippet, lang.label, shareUrl, toast]);

  const handleDownload = useCallback(() => {
    if (!snippet) return;
    downloadFile(filename, snippet.code);
    toast({ variant: 'success', title: 'Download started', description: filename });
  }, [snippet, filename, toast]);

  const handleCopyCode = useCallback(async () => {
    if (!snippet) return;
    const ok = await copyText(snippet.code);
    toast(
      ok
        ? { variant: 'success', title: 'Code copied', description: `${countLines(snippet.code)} lines on your clipboard.` }
        : { variant: 'error', title: 'Copy failed', description: 'Clipboard access was blocked.' },
    );
  }, [snippet, toast]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <SnippetSkeleton />
      </div>
    );
  }

  if (error || !snippet) {
    return <ErrorPanel error={error} onRetry={() => setReloadKey((key) => key + 1)} />;
  }

  const expires = snippet.expiresAt;
  const expired = countdown === 'expired';

  const menuItems = [
    { icon: FiCopy, label: 'Copy code', onClick: handleCopyCode, hint: '⌘C' },
    { icon: FiLink2, label: 'Copy link', onClick: handleShare },
    { icon: FiShare2, label: 'Share…', onClick: handleShare },
    { icon: FiDownload, label: 'Download file', onClick: handleDownload, dividerBefore: true },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:pt-10">
      {/* Breadcrumb + heading ------------------------------------- */}
      <div className="animate-fade-up">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 transition-colors hover:text-ink-100"
        >
          <FiArrowLeft aria-hidden="true" />
          New snippet
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: lang.accent }}
                  aria-hidden="true"
                />
                {lang.label}
              </span>
              {expires ? (
                <span
                  className={cn(
                    'chip',
                    expired ? 'border-flare-500/40 bg-flare-500/10 text-flare-100' : 'border-aqua-500/30 bg-aqua-500/10 text-aqua-200',
                  )}
                >
                  <FiClock aria-hidden="true" />
                  {expired ? 'Expired' : `Expires in ${countdown ?? '…'}`}
                </span>
              ) : (
                <span className="chip">
                  <FiClock aria-hidden="true" />
                  Never expires
                </span>
              )}
              {snippet.createdAt && <span className="chip">Created {timeAgo(snippet.createdAt)}</span>}
              {demo && (
                <span className="chip border-brand-400/30 bg-brand-500/10 text-brand-100">
                  <FiZap aria-hidden="true" />
                  Local only
                </span>
              )}
            </div>

            <h1 className="mt-4 break-all font-display text-4xl font-semibold uppercase leading-none tracking-tight text-white sm:text-5xl">
              {filename}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-400">
              <span>Short link</span>
              <code className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-0.5 font-mono text-xs text-ink-100">
                /{uniqueCode}
              </code>
              <Link
                to={`/raw/${uniqueCode}`}
                className="chip transition-colors hover:border-white/25 hover:text-white"
                title="Open the plain-text version"
              >
                <FiTerminal aria-hidden="true" />
                /raw/{uniqueCode}
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CopyButton
              value={shareUrl}
              label="Copy link"
              icon={FiLink2}
              className="btn-primary px-4 py-2.5"
              toastTitle="Link copied"
              toastBody="Paste it anywhere."
            />
            <Link to="/" className="btn-secondary px-4 py-2.5">
              <FiPlus aria-hidden="true" />
              New snippet
            </Link>
          </div>
        </div>
      </div>

      {/* Code + sidebar ------------------------------------------- */}
      <div className="mt-7 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative">
          <CodeBlock
            code={snippet.code}
            language={snippet.language}
            filename={filename}
            actions={<DropdownMenu items={menuItems} />}
            footer={
              <>
                <span>{formatCount(countLines(snippet.code))} lines</span>
                <span>{formatBytes(snippet.code)}</span>
                <span className="hidden sm:inline">Created {timeAgo(snippet.createdAt) || 'just now'}</span>
                {expires && <span className="hidden md:inline">Expires {formatDateTime(expires)}</span>}
              </>
            }
          />

          {/* Expiry overlay — a cached page can outlive the snippet itself. */}
          {expired && (
            <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-ink-950/85 p-6 text-center backdrop-blur-sm animate-fade-in">
              <div className="max-w-sm">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-flare-500/30 bg-flare-500/10 text-xl text-flare-400">
                  <FiClock aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-2xl font-semibold uppercase tracking-tight text-white">
                  This snippet expired
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-ink-300">
                  It has been removed from the database. Paste it again to create a fresh link.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="btn-secondary px-3 py-2 text-xs">
                    <FiRefreshCw aria-hidden="true" />
                    Refresh
                  </button>
                  <Link to="/" className="btn-primary px-3 py-2 text-xs">
                    <FiPlus aria-hidden="true" />
                    New snippet
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
          {/* Share card */}
          <section className="panel panel-sheen p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <FiLink2 className="text-brand-200" aria-hidden="true" />
              Share
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-400">
              Anyone with this link can read the snippet — no account required.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <input
                readOnly
                value={shareUrl}
                onFocus={(event) => event.target.select()}
                className="field h-9 flex-1 font-mono text-xs"
                aria-label="Snippet URL"
              />
              <CopyButton
                value={shareUrl}
                label=""
                icon={FiLink2}
                className="icon-btn h-9 w-9 shrink-0 border border-white/10 bg-white/[0.05]"
                toastTitle="Link copied"
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={handleShare} className="btn-secondary px-2 py-2 text-xs">
                <FiShare2 aria-hidden="true" />
                Share
              </button>
              <a
                href={rawUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary px-2 py-2 text-xs"
              >
                <FiExternalLink aria-hidden="true" />
                Raw
              </a>
            </div>
          </section>

          {/* Details */}
          <section className="panel panel-sheen p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <FiFileText className="text-aqua-300" aria-hidden="true" />
              Details
            </h2>
            <dl className="mt-3">
              <MetaRow icon={FiHash} label="Snippet ID" mono>
                {uniqueCode}
              </MetaRow>
              <MetaRow icon={FiFileText} label="Language">{lang.label}</MetaRow>
              <MetaRow icon={FiHash} label="Lines">{formatCount(countLines(snippet.code))}</MetaRow>
              <MetaRow icon={FiFileText} label="Size">{formatBytes(snippet.code)}</MetaRow>
              {snippet.createdAt && (
                <MetaRow icon={FiClock} label="Created">{timeAgo(snippet.createdAt)}</MetaRow>
              )}
              <MetaRow icon={FiClock} label="Expires">
                {expires ? (expired ? 'Expired' : countdown) : 'Never'}
              </MetaRow>
            </dl>
          </section>

          {/* Raw endpoint tip */}
          <section className="panel panel-sheen p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <FiTerminal className="text-flare-400" aria-hidden="true" />
              Grab it from the CLI
            </h2>
            <pre className="mt-3 overflow-x-auto rounded-xl border border-white/[0.07] bg-ink-950/70 px-3 py-2.5 font-mono text-[11.5px] leading-relaxed text-ink-200">
              <code>{`curl -s ${rawUrl || `/${uniqueCode}/raw`}`}</code>
            </pre>
            <div className="mt-3">
              <CopyButton
                value={rawUrl}
                label="Copy raw URL"
                icon={FiLink2}
                className="btn-secondary w-full px-3 py-2 text-xs"
                toastTitle="Raw URL copied"
              />
            </div>
          </section>

          {/* Housekeeping */}
          <section className="panel p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <FiGithub className="text-ink-300" aria-hidden="true" />
              Keep it tidy
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-ink-400">
              Snippets are immutable once created — nothing to edit or clean up. When a snippet
              expires it is deleted from the database automatically.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <button type="button" onClick={handleCopyCode} className="btn-secondary justify-start px-3 py-2 text-xs">
                <FiCopy aria-hidden="true" />
                Copy the code again
              </button>
              <a
                href="https://github.com/LazyShuyaa/SnippetsBin"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary justify-start px-3 py-2 text-xs"
              >
                <FiGithub aria-hidden="true" />
                Star the repo
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
