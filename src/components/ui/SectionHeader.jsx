import React from 'react';
import clsx from 'clsx';

/**
 * SectionHeader
 * Standardized section heading used between page sections.
 * Replaces the inconsistent "flex items-baseline justify-between mb-4"
 * pattern repeated across Dashboard, Guilds, Doctor, Encyclopedia, etc.
 *
 * Props:
 *   eyebrow:    string                       — small uppercase kicker
 *   title:      string | ReactNode (required)
 *   description: string                      — supporting line under title
 *   icon:       LucideIcon                   — small icon to the left of title
 *   trailing:   ReactNode                   — right-aligned actions (tabs, buttons, chips)
 *   size:       'sm' | 'md'                  — default 'md'
 *   align:      'left' | 'between'           — 'between' puts trailing on right
 */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  trailing,
  size = 'md',
  align = 'between',
  className,
}) {
  const isBetween = align === 'between';

  return (
    <header
      className={clsx(
        'flex flex-col gap-3',
        isBetween && 'sm:flex-row sm:items-end sm:justify-between',
        !isBetween && 'sm:flex-row sm:items-center',
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <div className="eyebrow text-fg-subtle mb-1.5">{eyebrow}</div>
        )}
        {size === 'sm' ? (
          <h3 className="text-h3 text-fg flex items-center gap-2 min-w-0">
            {Icon && <Icon className="w-3.5 h-3.5 text-fg-subtle shrink-0" strokeWidth={2} />}
            <span className="truncate">{title}</span>
          </h3>
        ) : (
          <h2 className="text-h2 text-fg flex items-center gap-2 min-w-0">
            {Icon && <Icon className="w-4 h-4 text-fg-muted shrink-0" strokeWidth={2} />}
            <span className="truncate">{title}</span>
          </h2>
        )}
        {description && (
          <p className="text-body text-fg-muted mt-1.5 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {trailing && <div className="flex flex-wrap items-center gap-2 shrink-0">{trailing}</div>}
    </header>
  );
}
