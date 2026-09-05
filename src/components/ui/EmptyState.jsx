import React from 'react';
import clsx from 'clsx';

/**
 * EmptyState — Block 4 / P4
 * Polished, on-brand empty-state surface.
 *
 * Props:
 *   icon         LucideIcon | ReactNode
 *   title        string (required)
 *   description  string
 *   action       { label, onClick, icon?, tone? }
 *   secondary    { label, onClick, icon? }
 *   size         'sm' | 'md' (default 'md')
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondary,
  size = 'md',
  className,
  children,
}) {
  const isSm = size === 'sm';

  return (
    <div
      className={clsx(
        'card-inset text-center flex flex-col items-center',
        isSm ? 'p-6' : 'p-10',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {Icon && (
        <div
          className={clsx(
            'rounded-md flex items-center justify-center mb-4',
            isSm ? 'w-10 h-10' : 'w-12 h-12'
          )}
          style={{
            background: 'var(--accent-soft)',
            color: 'var(--accent)',
            border: '1px solid var(--accent-border-25)',
          }}
          aria-hidden="true"
        >
          {React.isValidElement(Icon) ? (
            Icon
          ) : Icon ? (
            <Icon className={isSm ? 'w-4 h-4' : 'w-5 h-5'} strokeWidth={2} />
          ) : null}
        </div>
      )}

      <h3 className={isSm ? 'text-h3 text-fg' : 'text-h2 text-fg'}>{title}</h3>

      {description && (
        <p
          className={clsx(
            'text-body text-fg-muted max-w-sm leading-relaxed',
            isSm ? 'mt-1' : 'mt-2'
          )}
        >
          {description}
        </p>
      )}

      {children}

      {(action || secondary) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {secondary && (
            <button
              type="button"
              onClick={secondary.onClick}
              className="btn btn-secondary"
            >
              {secondary.icon ? (
                React.isValidElement(secondary.icon) ? (
                  secondary.icon
                ) : (
                  <secondary.icon className="w-3.5 h-3.5" strokeWidth={2} />
                )
              ) : null}
              <span>{secondary.label}</span>
            </button>
          )}
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="btn btn-primary"
            >
              {action.icon ? (
                React.isValidElement(action.icon) ? (
                  action.icon
                ) : (
                  <action.icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                )
              ) : null}
              <span>{action.label}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}