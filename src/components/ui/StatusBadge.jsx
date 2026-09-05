import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Sparkles, Bot } from 'lucide-react';

/**
 * StatusBadge
 * Replaces the 3 duplicated inline-styled ternary chips across
 * RecentActivity, DiagnosisResult, TreeDetailModal, GuildsHub.
 *
 * Variants:
 *   healthy  — emerald
 *   attention — amber
 *   critical — red
 *   neutral  — default chip
 *   verified — purple (for "AI verified" timeline chips, etc.)
 *   live     — emerald with pulsing dot
 *
 * Sizes: sm (default) | xs
 */
const VARIANT = {
  healthy:   { fg: 'var(--status-healthy-fg)',   border: 'var(--status-healthy-border)',   bg: 'var(--status-healthy-bg)',   Icon: ShieldCheck },
  attention: { fg: 'var(--status-attention-fg)', border: 'var(--status-attention-border)', bg: 'var(--status-attention-bg)', Icon: AlertTriangle },
  critical:  { fg: 'var(--status-critical-fg)',  border: 'var(--status-critical-border)',  bg: 'var(--status-critical-bg)',  Icon: AlertOctagon },
  neutral:   { fg: 'var(--fg-muted)',            border: 'var(--border)',                   bg: 'var(--bg)',                  Icon: null },
  verified:  { fg: 'var(--accent-mildew-fg)',    border: 'var(--accent-mildew-border)',    bg: 'var(--accent-mildew-bg)',    Icon: Sparkles },
  live:      { fg: 'var(--accent)',              border: 'var(--accent-border-25)',        bg: 'var(--accent-soft)',        Icon: null },
  ai:        { fg: 'var(--accent)',              border: 'var(--accent-border-25)',        bg: 'var(--accent-soft)',        Icon: Bot },
};

export default function StatusBadge({
  variant = 'neutral',
  label,
  icon: IconOverride,
  withIcon = true,
  size = 'sm',
  pulse = false,
  className,
}) {
  const v = VARIANT[variant] || VARIANT.neutral;
  const Icon = IconOverride ?? (withIcon ? v.Icon : null);

  const sizeStyle =
    size === 'xs'
      ? { fontSize: '10px', lineHeight: '14px', padding: '2px 8px' }
      : { fontSize: '11px', lineHeight: '16px', padding: '4px 10px' };

  return (
    <span
      className={`chip ${className || ''}`}
      style={{
        color: v.fg,
        borderColor: v.border,
        background: v.bg,
        ...sizeStyle,
      }}
    >
      {pulse && (
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: v.fg }}
        />
      )}
      {Icon && <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} strokeWidth={2} />}
      <span>{label}</span>
    </span>
  );
}

/**
 * Helper: map a tree/diagnosis status string to a StatusBadge variant.
 * Keeps the call sites clean.
 */
export function statusVariant(status) {
  switch (status) {
    case 'Healthy':           return 'healthy';
    case 'Needs Attention':   return 'attention';
    case 'Critical':          return 'critical';
    case 'None':              return 'healthy';
    case 'Moderate':          return 'attention';
    case 'Severe':            return 'critical';
    default:                  return 'neutral';
  }
}
