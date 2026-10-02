import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

const VARIANTS = {
  success: {
    icon: FiCheckCircle,
    accent: 'from-aqua-400 to-aqua-500',
    ring: 'text-aqua-300',
  },
  error: {
    icon: FiAlertTriangle,
    accent: 'from-flare-400 to-rose-500',
    ring: 'text-flare-400',
  },
  info: {
    icon: FiInfo,
    accent: 'from-brand-400 to-brand-500',
    ring: 'text-brand-300',
  },
};

const DEFAULT_DURATION = 3800;
let counter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'info', duration = DEFAULT_DURATION }) => {
      counter += 1;
      const id = counter;
      setToasts((current) => [...current.slice(-2), { id, title, description, variant, duration }]);
      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss],
  );

  useEffect(() => () => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current.clear();
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} toast={item} onDismiss={() => dismiss(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onDismiss }) {
  const variant = VARIANTS[toast.variant] || VARIANTS.info;
  const Icon = variant.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className="panel panel-sheen pointer-events-auto relative w-full overflow-hidden p-3.5 pr-10 animate-slide-in-right sm:w-[22rem]"
    >
      <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${variant.accent}`} />
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 shrink-0 text-lg ${variant.ring}`}>
          <Icon aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          {toast.title && <p className="text-sm font-semibold text-white">{toast.title}</p>}
          {toast.description && (
            <p className="mt-0.5 text-xs leading-relaxed text-ink-300">{toast.description}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-1.5 top-1.5 icon-btn h-7 w-7 text-ink-400 hover:text-white"
        aria-label="Dismiss notification"
      >
        <FiX aria-hidden="true" />
      </button>
      <span
        className={`toast-progress absolute bottom-0 left-0 h-[2px] bg-gradient-to-r ${variant.accent}`}
        style={{ animationDuration: `${toast.duration}ms` }}
      />
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context.toast;
}

export default ToastProvider;
