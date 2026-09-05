import React from 'react';
import Modal from './Modal';
import { AlertTriangle, AlertCircle, AlertOctagon, HelpCircle, Trash2 } from 'lucide-react';

const TONE = {
  danger:   { Icon: AlertOctagon, fg: 'var(--status-critical-fg)',  border: 'var(--status-critical-border)',  bg: 'var(--status-critical-bg)' },
  warning:  { Icon: AlertTriangle,fg: 'var(--status-attention-fg)', border: 'var(--status-attention-border)', bg: 'var(--status-attention-bg)' },
  info:     { Icon: AlertCircle,  fg: 'var(--accent)',              border: 'var(--accent-border-25)',        bg: 'var(--accent-soft)' },
  question: { Icon: HelpCircle,   fg: 'var(--accent)',              border: 'var(--accent-border-25)',        bg: 'var(--accent-soft)' },
  destructive: { Icon: Trash2,    fg: 'var(--status-critical-fg)',  border: 'var(--status-critical-border)',  bg: 'var(--status-critical-bg)' },
};

/**
 * ConfirmDialog
 * Replacement for native `window.confirm()`. Preserves the same
 * callback semantics: `onConfirm` fires only when the user
 * explicitly clicks the confirm button.
 *
 * Props:
 *   open          boolean
 *   onClose       () => void
 *   onConfirm     () => void          — fires on confirm
 *   title         string (required)
 *   description   string | ReactNode
 *   confirmLabel  string              — default 'Confirm'
 *   cancelLabel   string              — default 'Cancel'
 *   tone          'danger' | 'warning' | 'info' | 'question' | 'destructive'
 *                                    — default 'question'
 *   loading       boolean             — disables confirm + shows spinner state
 *   hideCancel    boolean
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'question',
  loading = false,
  hideCancel = false,
}) {
  const t = TONE[tone] || TONE.question;
  const { Icon } = t;

  const handleConfirm = () => {
    if (loading) return;
    onConfirm?.();
  };

  const footer = (
    <>
      {!hideCancel && (
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="btn btn-secondary"
        >
          <span>{cancelLabel}</span>
        </button>
      )}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={loading}
        className={tone === 'danger' || tone === 'destructive' ? 'btn btn-primary' : 'btn btn-primary'}
        style={
          tone === 'danger' || tone === 'destructive'
            ? {
                background: 'var(--status-critical-fg)',
                borderColor: 'var(--status-critical-fg)',
                color: 'var(--fg)',
              }
            : undefined
        }
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
        <span>{loading ? 'Working…' : confirmLabel}</span>
      </button>
    </>
  );

  const headerNode = (
    <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-line">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
          style={{ background: t.bg, color: t.fg, border: `1px solid ${t.border}` }}
          aria-hidden="true"
        >
          <Icon className="w-4 h-4" strokeWidth={2.5} />
        </div>
        <h2 className="text-h2 text-fg truncate">{title}</h2>
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title={title}
      size="sm"
      dismissible={!loading}
      hideClose
      header={headerNode}
      footer={footer}
      className="!max-w-md"
    >
      {description && (
        <p className="text-body text-fg-muted leading-relaxed">
          {description}
        </p>
      )}
    </Modal>
  );
}