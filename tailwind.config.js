/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        },
        forest: {
          800: '#0c221a',
          900: '#071610',
          950: '#030c08'
        },
        /* Token-mapped Tailwind colors.
           These read from CSS variables defined in src/index.css
           so a single source of truth governs both the raw hex and
           the Tailwind utility namespace. */
        surface: {
          page:    'var(--surface-page)',
          1:       'var(--surface-1)',
          2:       'var(--surface-2)',
          3:       'var(--surface-3)',
          inset:   'var(--surface-inset)',
        },
        fg: {
          DEFAULT: 'var(--fg)',
          muted:   'var(--fg-muted)',
          subtle:  'var(--fg-subtle)',
        },
        line: {
          DEFAULT:  'var(--border)',
          strong:   'var(--border-strong)',
          elev:     'var(--border-elev)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover:   'var(--accent-hover)',
          fg:      'var(--accent-fg)',
          soft:    'var(--accent-soft)',
        },
        status: {
          healthy:    'var(--status-healthy-fg)',
          attention:  'var(--status-attention-fg)',
          critical:   'var(--status-critical-fg)',
          mildew:     'var(--accent-mildew-fg)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        /* Type scale — roles. Exposed so utilities like
           text-h1 / text-h2 / text-body are available alongside
           existing text-[Npx] literals. */
        display: ['var(--text-display-size)', { lineHeight: 'var(--text-display-lh)', letterSpacing: 'var(--tracking-display)', fontWeight: '600' }],
        h1:      ['var(--text-h1-size)',      { lineHeight: 'var(--text-h1-lh)',      letterSpacing: 'var(--tracking-h1)',      fontWeight: '600' }],
        h2:      ['var(--text-h2-size)',      { lineHeight: 'var(--text-h2-lh)',      letterSpacing: 'var(--tracking-h2)',      fontWeight: '600' }],
        h3:      ['var(--text-h3-size)',      { lineHeight: 'var(--text-h3-lh)',      letterSpacing: 'var(--tracking-h3)',      fontWeight: '600' }],
        body:    ['var(--text-body-size)',    { lineHeight: 'var(--text-body-lh)',    letterSpacing: 'var(--tracking-body)' }],
        caption: ['var(--text-caption-size)', { lineHeight: 'var(--text-caption-lh)', letterSpacing: 'var(--tracking-caption)' }],
      },
      borderRadius: {
        /* IMPORTANT: do not override the default Tailwind scale.
           rounded-md (6px) and rounded-lg (8px) are used in 70+
           JSX locations and must keep their current rendered values
           for this block to be visually non-breaking.
           New token-mapped sizes are added under non-conflicting
           names. */
        card:  'var(--radius-md)',  /* 10px — .surface (use .rounded-card) */
        hero:  'var(--radius-lg)',  /* 14px — future primary cards (use .rounded-hero) */
        panel: 'var(--radius-xl)',  /* 18px — future hero surfaces (use .rounded-panel) */
      },
      spacing: {
        /* Spacing scale. Tailwind's default scale (1 = 0.25rem) is
           left intact so existing p-3 / p-4 / p-5 literals still
           work. The named keys below are additive. */
        'space-1':  'var(--space-1)',
        'space-2':  'var(--space-2)',
        'space-3':  'var(--space-3)',
        'space-4':  'var(--space-4)',
        'space-5':  'var(--space-5)',
        'space-6':  'var(--space-6)',
        'space-8':  'var(--space-8)',
        'space-10': 'var(--space-10)',
        'space-12': 'var(--space-12)',
        'space-16': 'var(--space-16)',
      },
      boxShadow: {
        card:     'var(--shadow-card)',
        elevated: 'var(--shadow-elevated)',
        popover:  'var(--shadow-popover)',
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.16, 1, 0.3, 1)',
        standard:    'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        fast:  '120ms',
        base:  '160ms',
        slow:  '240ms',
      },
      animation: {
        'scan-laser':  'laser 2s ease-in-out infinite',
        'pulse-glow':  'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':       'float 3s ease-in-out infinite',
        'enter':       'enter 240ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        laser: {
          '0%, 100%': { top: '5%', opacity: '0.8' },
          '50%': { top: '90%', opacity: '1' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        enter: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
