import React from 'react';
import clsx from 'clsx';
import { Sprout, ArrowUpRight } from 'lucide-react';

/**
 * PageHero
 * The page-level visual thesis. Renders:
 *   - Eyebrow (small uppercase kicker, optional)
 *   - Display headline
 *   - Supporting description (optional)
 *   - Optional live/status chip on the right
 *   - Optional primary CTA + secondary action
 *   - Optional metadata strip (e.g. "8 saplings · 96% survival")
 *
 * Designed to give every view a real "opening" instead of a flat
 * row of identical-looking cards. Hierarchy beats uniformity.
 *
 * Props:
 *   eyebrow:        string
 *   title:          string | ReactNode  (required)
 *   description:    string | ReactNode
 *   chip:           { label, tone }     — renders the live pill on the right
 *   cta:            { label, onClick, icon?, tone? }   — primary CTA
 *   action:         { label, onClick, icon? }          — secondary text/button
 *   meta:           ReactNode (replaces the chip row; used for stat strips)
 *   showBrandMark:  boolean (default true) — show the leaf mark next to eyebrow
 *   children:       ReactNode — full-width content below the hero (e.g. stat strip)
 *   align:          'left' | 'center' (default 'left')
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  chip,
  cta,
  action,
  meta,
  showBrandMark = true,
  children,
  align = 'left',
  className,
}) {
  const isCenter = align === 'center';

  return (
    <section
      className={clsx(
        'relative overflow-hidden card-elevated',
        'p-6 sm:p-8',
        className
      )}
    >
      {/* Decorative leaf ring — subtle, low-opacity, never animated.
          Sits behind content; keeps the "environmental product" tone
          without leaning on glassmorphism or gradients. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(34,197,94,0.10), rgba(34,197,94,0) 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 bottom-0 w-32 h-32 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(34,197,94,0.05), rgba(34,197,94,0) 70%)',
        }}
      />

      <div
        className={clsx(
          'relative flex flex-col gap-5',
          isCenter ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
        )}
      >
        <div className={clsx('min-w-0', isCenter ? 'max-w-2xl' : 'flex-1')}>
          {eyebrow && (
            <div
              className={clsx(
                'flex items-center gap-2 mb-3 text-caption text-fg-subtle',
                isCenter && 'justify-center'
              )}
            >
              {showBrandMark && (
                <span
                  className="inline-flex w-5 h-5 items-center justify-center rounded-sm"
                  style={{
                    background: 'var(--accent-soft)',
                    color: 'var(--accent)',
                  }}
                >
                  <Sprout className="w-3 h-3" strokeWidth={2.5} />
                </span>
              )}
              <span className="eyebrow">{eyebrow}</span>
            </div>
          )}

          <h1
            className="text-display text-fg tracking-tight"
            style={{ fontSize: '32px', lineHeight: '40px' }}
          >
            {title}
          </h1>

          {description && (
            <p
              className={clsx(
                'mt-3 max-w-2xl text-body text-fg-muted',
                isCenter && 'mx-auto'
              )}
              style={{ fontSize: '14px', lineHeight: '22px' }}
            >
              {description}
            </p>
          )}
        </div>

        {(chip || cta || action) && (
          <div
            className={clsx(
              'flex flex-wrap items-center gap-2',
              isCenter && 'justify-center'
            )}
          >
            {chip && (
              <span
                className="chip"
                style={
                  chip.tone === 'healthy'
                    ? {
                        color: 'var(--status-healthy-fg)',
                        borderColor: 'var(--status-healthy-border)',
                        background: 'var(--status-healthy-bg)',
                      }
                    : chip.tone === 'live'
                    ? {
                        color: 'var(--accent)',
                        borderColor: 'var(--accent-border-25)',
                        background: 'var(--accent-soft)',
                      }
                    : undefined
                }
              >
                {chip.tone === 'live' && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--accent)' }}
                    aria-hidden="true"
                  />
                )}
                {chip.label}
              </span>
            )}

            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className="btn btn-secondary"
              >
                {action.icon ? (
                  <action.icon className="w-3.5 h-3.5" strokeWidth={2} />
                ) : null}
                <span>{action.label}</span>
              </button>
            )}

            {cta && (
              <button
                type="button"
                onClick={cta.onClick}
                className={clsx('btn', cta.tone === 'secondary' ? 'btn-secondary' : 'btn-primary')}
              >
                {cta.icon ? (
                  <cta.icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                )}
                <span>{cta.label}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {meta && (
        <div
          className={clsx(
            'relative mt-6 pt-5 border-t border-line',
            'grid gap-4 grid-cols-2 sm:grid-cols-4'
          )}
        >
          {meta}
        </div>
      )}

      {children && <div className="relative mt-6">{children}</div>}
    </section>
  );
}
