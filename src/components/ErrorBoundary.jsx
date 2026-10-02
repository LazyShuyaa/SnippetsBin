import React from 'react';
import { FiAlertOctagon, FiRefreshCw } from 'react-icons/fi';

/** Catches render-time crashes so a single bad snippet can't blank the app. */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-3xl text-flare-400">
          <FiAlertOctagon aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold uppercase tracking-tight text-white">
          Something went sideways
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-300">
          The interface hit an unexpected error. Reloading usually fixes it — your snippet is safe.
        </p>
        <pre className="mt-4 max-h-40 w-full overflow-auto rounded-xl border border-white/[0.07] bg-ink-950/70 p-3 text-left font-mono text-[11px] text-ink-400">
          {String(error?.stack || error?.message || error)}
        </pre>
        <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-6 px-4 py-2.5">
          <FiRefreshCw aria-hidden="true" />
          Reload the page
        </button>
      </div>
    );
  }
}
