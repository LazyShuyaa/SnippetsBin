import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiAlertTriangle, FiArrowLeft, FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';
import { getSnippet, NotFoundError } from '../lib/api';
import { copyText, countLines, formatBytes, formatCount } from '../lib/utils';

/**
 * Plain-text view of a snippet, for people who want the code without the
 * chrome. The layout stays deliberately quiet: one toolbar, then the code.
 */
export default function RawCodeView() {
  const { uniqueCode } = useParams();
  const [rawCode, setRawCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getSnippet(uniqueCode)
      .then((data) => {
        if (cancelled) return;
        setRawCode(data.code);
        document.title = `raw/${uniqueCode} — SnippetBin`;
      })
      .catch((fetchError) => {
        if (!cancelled) setError(fetchError);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [uniqueCode]);

  const handleCopy = async () => {
    const ok = await copyText(rawCode);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6" role="status" aria-live="polite">
        <div className="skeleton h-3 w-48" />
        <div className="mt-4 space-y-2.5" aria-hidden="true">
          {[70, 45, 82, 60].map((width, index) => (
            <span key={index} className="skeleton block h-3" style={{ width: `${width}%` }} />
          ))}
        </div>
        <span className="sr-only">Loading snippet…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl text-flare-400">
          <FiAlertTriangle aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold uppercase tracking-tight text-white">
          {error instanceof NotFoundError ? 'Not found' : 'Request failed'}
        </h1>
        <p className="mt-2 text-sm text-ink-300">{error.message || 'This snippet could not be loaded.'}</p>
        <Link to="/" className="btn-primary mt-6 px-4 py-2.5">
          <FiArrowLeft aria-hidden="true" />
          Back to SnippetBin
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="flex flex-wrap items-center gap-2 text-2xs text-ink-400">
          <span className="chip">raw</span>
          <span>{formatCount(countLines(rawCode))} lines</span>
          <span className="text-ink-600">·</span>
          <span>{formatBytes(rawCode)}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={handleCopy} className="btn-secondary px-3 py-2 text-xs">
            {copied ? <FiCheck className="text-aqua-300" aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <Link to={`/${uniqueCode}`} className="btn-secondary px-3 py-2 text-xs">
            <FiExternalLink aria-hidden="true" />
            Pretty view
          </Link>
        </div>
      </div>

      <pre className="whitespace-pre-wrap break-words pb-16 font-mono text-[13px] leading-6 text-ink-100">
        {rawCode}
      </pre>
    </div>
  );
}
