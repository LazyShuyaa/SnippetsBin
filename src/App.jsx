import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { FiCompass } from 'react-icons/fi';
import Layout from './components/Layout';
import SnippetForm from './components/SnippetForm';
import SnippetView from './components/SnippetView';
import RawCodeView from './components/RawCodeView';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';

/** Reset scroll position on navigation (but not for in-page hash jumps). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-3xl text-brand-200">
        <FiCompass aria-hidden="true" />
      </span>
      <p className="mt-6 font-display text-6xl font-semibold uppercase tracking-tight text-white">404</p>
      <h1 className="mt-2 text-lg font-semibold text-ink-100">This page took a wrong turn</h1>
      <p className="mt-2 text-sm text-ink-300">
        The page you were looking for does not exist. Snippet links look like <code className="font-mono text-ink-100">/abc12</code>.
      </p>
      <Link to="/" className="btn-primary mt-7 px-4 py-2.5">
        Back to the editor
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<SnippetForm />} />
              <Route path="/raw/:uniqueCode" element={<RawCodeView />} />
              <Route path="/:uniqueCode" element={<SnippetView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </ErrorBoundary>
      </ToastProvider>
    </Router>
  );
}
