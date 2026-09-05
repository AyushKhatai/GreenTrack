import React, { useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const SIZE_CLASS = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

/**
 * Modal
 * The single source of truth for dialog rendering across GreenTrack.
 *
 * Behavior contract:
 *  - Backdrop click closes the modal (unless `dismissible={false}`)
 *  - ESC closes the modal (unless `dismissible={false}`)
 *  - <body> scroll is locked while open (releases on unmount)
 *  - Focus is moved into the panel on open and restored on close
 *  - Uses `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
 *  - Backdrop has `backdrop-blur-sm` and a deep translucent fill
 *
 * Props:
 *   open           boolean           — controls visibility
 *   onClose        () => void        — close handler
 *   title          string | ReactNode (required)
 *   subtitle       string | ReactNode
 *   icon           LucideIcon
 *   iconSlot       ReactNode         — for emoji / custom glyphs
 *   size           'sm' | 'md' | 'lg' | 'xl' (default 'md')
 *   dismissible    boolean           — default true (backdrop + ESC)
 *   hideClose      boolean           — hide the X button (default false)
 *   closeOnBackdrop boolean          — default true
 *   closeOnEscape  boolean           — default true
 *   header         ReactNode         — full custom header override
 *   footer         ReactNode         — sticky footer slot
 *   contentClassName string          — extra classes for body
 *   initialFocusRef RefObject        — element to focus on open
 *   children       ReactNode
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon: Icon,
  iconSlot,
  size = 'md',
  dismissible = true,
  hideClose = false,
  closeOnBackdrop = true,
  closeOnEscape = true,
  header,
  footer,
  contentClassName,
  initialFocusRef,
  className,
  children,
}) {
  const panelRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2, 9)}`).current;

  const handleClose = useCallback(() => {
    if (dismissible) onClose?.();
  }, [dismissible, onClose]);

  // Body scroll lock + focus management
  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = document.activeElement;
    document.documentElement.classList.add('modal-open');

    // Move focus into the panel
    const t = setTimeout(() => {
      const target =
        initialFocusRef?.current ||
        panelRef.current?.querySelector('[data-autofocus]') ||
        panelRef.current;
      target?.focus?.();
    }, 30);

    return () => {
      clearTimeout(t);
      document.documentElement.classList.remove('modal-open');
      const last = lastFocusedRef.current;
      if (last && typeof last.focus === 'function') {
        try { last.focus(); } catch (_) { /* noop */ }
      }
    };
  }, [open, initialFocusRef]);

  // ESC key
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handleClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeOnEscape, handleClose]);

  // Focus trap (very lightweight — keeps tabbing inside the panel)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.md;
  const glyph = iconSlot || (Icon ? <Icon className="w-4 h-4" strokeWidth={2.5} /> : null);

  const headerNode = header ?? (
    <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-line">
      <div className="flex items-center gap-3 min-w-0">
        {glyph && (
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 text-[18px]"
            style={{
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border-25)',
            }}
            aria-hidden="true"
          >
            {glyph}
          </div>
        )}
        <div className="min-w-0">
          <h2 id={titleId} className="text-h2 text-fg truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-body text-fg-muted mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {!hideClose && (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close dialog"
          className="icon-btn shrink-0 focus-ring"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      )}
    </div>
  );

  const onBackdropClick = (e) => {
    if (!closeOnBackdrop) return;
    if (e.target === e.currentTarget) handleClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto modal-overlay"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onMouseDown={onBackdropClick}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={clsx(
          'card-elevated w-full overflow-hidden modal-panel flex flex-col max-h-[90vh] my-6 focus:outline-none',
          sizeClass,
          className
        )}
      >
        {headerNode}

        <div
          className={clsx(
            'flex-1 overflow-y-auto',
            footer ? 'px-5 py-5' : 'px-5 py-5',
            contentClassName
          )}
        >
          {children}
        </div>

        {footer && (
          <div className="px-5 py-3 border-t border-line bg-surface-1 flex flex-wrap items-center justify-between gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}