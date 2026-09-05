import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { CheckCircle2, AlertTriangle, AlertCircle, Sparkles, X, Info } from 'lucide-react';

const VARIANT = {
  success: { fg: 'var(--status-healthy-fg)',   border: 'var(--status-healthy-border)',   bg: 'var(--status-healthy-bg)',   Icon: CheckCircle2 },
  info:    { fg: 'var(--accent)',              border: 'var(--accent-border-25)',        bg: 'var(--accent-soft)',        Icon: Info },
  warning: { fg: 'var(--status-attention-fg)', border: 'var(--status-attention-border)', bg: 'var(--status-attention-bg)', Icon: AlertTriangle },
  error:   { fg: 'var(--status-critical-fg)',  border: 'var(--status-critical-border)',  bg: 'var(--status-critical-bg)',  Icon: AlertCircle },
};

const DEFAULT_DURATION = {
  success: 2800,
  info:    3200,
  warning: 4200,
  error:   5200,
};

const ToastContext = createContext(null);

/**
 * ToastProvider
 * Wraps the app and exposes a `useToast()` hook.
 *
 * useToast() returns:
 *   toast(message, opts)
 *     opts: { variant?: 'success'|'info'|'warning'|'error',
 *              title?: string,
 *              duration?: number (ms), // 0 = sticky
 *              dismissible?: boolean }
 *   dismiss(id)
 *   clear()
 */
export function ToastProvider({ children, max = 5 }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => setToasts([]), []);

  const toast = useCallback((message, opts = {}) => {
    const id = ++idRef.current;
    const variant = opts.variant || 'success';
    const duration = opts.duration ?? DEFAULT_DURATION[variant] ?? 3200;
    const entry = {
      id,
      message,
      title: opts.title,
      variant,
      duration,
      dismissible: opts.dismissible !== false,
      createdAt: Date.now(),
    };
    setToasts((prev) => {
      const next = [...prev, entry];
      return next.length > max ? next.slice(next.length - max) : next;
    });
    return id;
  }, [max]);

  const value = useMemo(() => ({ toast, dismiss, clear }), [toast, dismiss, clear]);

  // Bridge the module-level bus into the in-React toast queue.
  useEffect(() => {
    return onToast((payload) => toast(payload.message, payload));
  }, [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
}

/**
 * Module-level event bus so non-React modules (storage, network)
 * can request a toast without importing React hooks.
 *
 *   import { notifyError } from '../components/ui/Toast';
 *   notifyError('Cloud sync failed — using local cache.');
 *
 * Includes a per-key rate limit (15s) so noisy errors don't spam the
 * toast queue.
 */
const bus = {
  listeners: new Set(),
};
const lastFired = new Map(); // message → timestamp
const RATE_LIMIT_MS = 15000;

function shouldEmit(message) {
  const now = Date.now();
  const last = lastFired.get(message) || 0;
  if (now - last < RATE_LIMIT_MS) return false;
  lastFired.set(message, now);
  return true;
}

export function onToast(listener) {
  bus.listeners.add(listener);
  return () => bus.listeners.delete(listener);
}

function emit(payload) {
  if (!shouldEmit(payload.message)) return;
  bus.listeners.forEach((l) => l(payload));
}

export function notifyError(message, title) {
  emit({ variant: 'error', message, title, duration: 5200 });
}
export function notifyWarning(message, title) {
  emit({ variant: 'warning', message, title, duration: 4200 });
}
export function notifyInfo(message, title) {
  emit({ variant: 'info', message, title, duration: 3200 });
}

function ToastViewport({ toasts, onDismiss }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 max-w-sm w-[calc(100%-3rem)] pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  );
}

function Toast({ toast, onDismiss }) {
  const v = VARIANT[toast.variant] || VARIANT.success;
  const { Icon } = v;
  const sticky = !toast.duration;

  useEffect(() => {
    if (sticky) return;
    const handle = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(handle);
  }, [toast.id, toast.duration, sticky, onDismiss]);

  return (
    <div
      role="status"
      className={clsx(
        'pointer-events-auto relative overflow-hidden rounded-md border bg-surface-2 modal-panel shadow-lg',
        'flex items-start gap-2.5 px-3.5 py-3 pr-2'
      )}
      style={{
        borderColor: v.border,
        background: v.bg,
      }}
    >
      <Icon
        className="w-3.5 h-3.5 shrink-0 mt-0.5"
        strokeWidth={2.5}
        style={{ color: v.fg }}
      />
      <div className="min-w-0 flex-1">
        {toast.title && (
          <div
            className="text-[12px] font-semibold truncate"
            style={{ color: v.fg }}
          >
            {toast.title}
          </div>
        )}
        <div className="text-[12px] text-fg-muted leading-snug">
          {toast.message}
        </div>
      </div>

      {toast.dismissible && (
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="icon-btn !w-6 !h-6 shrink-0"
          style={{ color: 'var(--fg-muted)' }}
        >
          <X className="w-3 h-3" strokeWidth={2} />
        </button>
      )}

      {!sticky && (
        <div
          aria-hidden="true"
          className="toast-progress absolute left-0 bottom-0 h-[2px] w-full"
          style={{
            background: v.fg,
            animationDuration: `${toast.duration}ms`,
          }}
        />
      )}
    </div>
  );
}