import React from 'react';
import clsx from 'clsx';

/**
 * StatNumber
 * One consistent system for KPI/stat numbers across the app.
 * Replaces the fragmented text-[28px] / text-[26px] / text-[22px] /
 * text-[20px] / text-[18px] / text-[16px] number-font drift.
 *
 * Sizes:
 *   xl — page-hero (32 / 40)
 *   lg — primary stat (26 / 32)
 *   md — card stat (22 / 28)
 *   sm — inline stat (18 / 24)
 *   xs — table cell (15 / 20)
 *
 * Tone: default | muted | healthy | attention | critical
 *
 * Sublabel renders a small uppercase eyebrow above the value.
 * Unit renders muted inline after the value (e.g. "kg", "%").
 */
const SIZE = {
  xl: { font: 32, line: 40, weight: 600, track: '-0.02em' },
  lg: { font: 26, line: 32, weight: 600, track: '-0.02em' },
  md: { font: 22, line: 28, weight: 600, track: '-0.01em' },
  sm: { font: 18, line: 24, weight: 600, track: '-0.01em' },
  xs: { font: 15, line: 20, weight: 600, track: '0' },
};

const TONE_COLOR = {
  default:   'var(--fg)',
  muted:     'var(--fg-muted)',
  healthy:   'var(--status-healthy-fg)',
  attention: 'var(--status-attention-fg)',
  critical:  'var(--status-critical-fg)',
};

export default function StatNumber({
  value,
  sublabel,
  unit,
  size = 'md',
  tone = 'default',
  icon: Icon,
  className,
  monospace = false,
}) {
  const s = SIZE[size] || SIZE.md;
  const color = TONE_COLOR[tone] || TONE_COLOR.default;

  return (
    <div className={clsx('flex flex-col gap-1 min-w-0', className)}>
      {sublabel && (
        <div className="eyebrow text-fg-subtle flex items-center gap-1.5">
          {Icon && <Icon className="w-3 h-3" strokeWidth={2} />}
          <span className="truncate">{sublabel}</span>
        </div>
      )}
      <div className="flex items-baseline gap-1.5 min-w-0">
        <span
          className="nums"
          style={{
            color,
            fontSize: `${s.font}px`,
            lineHeight: `${s.line}px`,
            fontWeight: s.weight,
            letterSpacing: s.track,
            fontFamily: monospace ? 'var(--font-mono)' : 'var(--font-sans)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="text-fg-subtle"
            style={{ fontSize: `${Math.max(11, s.font - 8)}px`, lineHeight: `${Math.max(16, s.line - 8)}px` }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * StatTile — a label + StatNumber block, used in card grids and
 * stat strips (e.g. Guilds, MyForest metrics, equivalents).
 */
export function StatTile({ label, value, unit, tone = 'default', size = 'md', sub, className }) {
  return (
    <div
      className={clsx(
        'card-inset px-4 py-3 flex flex-col gap-1.5 min-w-0',
        className
      )}
    >
      <div className="eyebrow text-fg-subtle">{label}</div>
      <StatNumber value={value} unit={unit} size={size} tone={tone} />
      {sub && <div className="text-caption text-fg-subtle" style={{ fontSize: '11px', lineHeight: '16px' }}>{sub}</div>}
    </div>
  );
}
