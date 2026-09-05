import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

/**
 * ErrorScreen — Block 4 / P4
 * Polished GreenTrack fallback rendered by ErrorBoundary when the
 * React tree throws. No technical details leak to the user — only
 * a plain-English explanation and a recovery action.
 */
export default function ErrorScreen({ onRetry }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 bg-[#0a0a0a] text-[#fafafa]"
      role="alert"
    >
      <div className="card-elevated max-w-md w-full p-8 text-center">
        <div
          className="w-14 h-14 rounded-md flex items-center justify-center mx-auto mb-4"
          style={{
            background: 'var(--status-critical-bg)',
            color: 'var(--status-critical-fg)',
            border: '1px solid var(--status-critical-border)',
          }}
          aria-hidden="true"
        >
          <AlertOctagon className="w-6 h-6" strokeWidth={2} />
        </div>
        <h1 className="text-h1 text-fg">Something went wrong</h1>
        <p className="text-body text-fg-muted mt-2 leading-relaxed">
          The canopy hit an unexpected snag rendering this view. Your registered
          trees and progress are safe — give it another go.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="btn btn-primary"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Try again</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
            className="btn btn-secondary"
          >
            <span>Reload page</span>
          </button>
        </div>
      </div>
    </div>
  );
}