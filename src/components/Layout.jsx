import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGithub, FiPlus, FiZap } from 'react-icons/fi';
import { useApiMode } from '../lib/useApiMode';

const REPO_URL = 'https://github.com/LazyShuyaa/SnippetsBin';

/** Gradient brand mark, kept in sync with the favicon. */
export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center rounded-xl border border-white/10 bg-ink-850 ${className}`}
    >
      <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/25 via-transparent to-aqua-500/20" />
      <svg viewBox="0 0 64 64" className="relative h-5 w-5" aria-hidden="true">
        <defs>
          <linearGradient id="brand-glyph" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a992ff" />
            <stop offset="1" stopColor="#38dcd0" />
          </linearGradient>
        </defs>
        <path
          d="M24 18 12 32l12 14M40 18l12 14-12 14"
          fill="none"
          stroke="url(#brand-glyph)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <div className="absolute inset-x-0 top-0 h-[540px] bg-grid mask-radial opacity-60" />
      <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-500/25 blur-[150px] animate-drift" />
      <div className="absolute -left-40 top-32 h-[420px] w-[420px] rounded-full bg-aqua-500/[0.14] blur-[140px] animate-float" />
      <div
        className="absolute -right-32 top-64 h-[460px] w-[460px] rounded-full bg-flare-500/[0.10] blur-[150px] animate-drift"
        style={{ animationDelay: '-6s' }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}

function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="group flex min-w-0 items-center gap-3 rounded-xl py-1 pr-2 transition-opacity hover:opacity-95"
          aria-label="SnippetBin home"
        >
          <LogoMark />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-display text-xl font-semibold uppercase tracking-[0.16em] text-white">
              Snippet<span className="text-gradient">Bin</span>
            </span>
            <span className="mt-0.5 hidden text-2xs uppercase tracking-[0.28em] text-ink-400 sm:block">
              paste · share · ship
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <DemoBadge />
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="icon-btn"
            aria-label="View source on GitHub"
            title="Star on GitHub"
          >
            <FiGithub className="text-base" aria-hidden="true" />
          </a>
          {!isHome && (
            <Link to="/" className="btn-primary px-3 py-2 text-sm">
              <FiPlus aria-hidden="true" />
              <span className="hidden sm:inline">New snippet</span>
              <span className="sm:hidden">New</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function DemoBadge() {
  const { demo } = useApiMode();
  if (!demo) return null;

  return (
    <span
      className="chip hidden border-brand-400/30 bg-brand-500/10 text-brand-100 md:inline-flex"
      title="The API is unreachable, so snippets are stored locally in this browser."
    >
      <FiZap className="text-brand-300" aria-hidden="true" />
      Demo mode
    </span>
  );
}

function Footer() {
  const { demo } = useApiMode();

  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-ink-950/60">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-100">
            <LogoMark className="h-6 w-6" />
            SnippetBin
          </div>
          <p className="text-xs text-ink-400">
            Built with React, Vite, Tailwind CSS &amp; Express · links expire on your schedule.
          </p>
          {demo && (
            <p className="text-xs text-brand-200/80">
              Demo mode: the API is offline, snippets are kept in this browser only.
            </p>
          )}
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-300">
          <Link to="/" className="link-underline">
            New snippet
          </Link>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="link-underline">
            GitHub
          </a>
          <a
            href={`${REPO_URL}#readme`}
            target="_blank"
            rel="noreferrer"
            className="link-underline"
          >
            Docs
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Background />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink-800 focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>
      <Header />
      <main id="content" className="flex w-full flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
