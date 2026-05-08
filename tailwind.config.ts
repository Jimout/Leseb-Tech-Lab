import type { Config } from 'tailwindcss'

/**
 * Tailwind v4: paired with `@config` in app/globals.css.
 * Hex values live only in globals.css (`:root` / `.dark`); here we expose semantic names → CSS variables.
 *
 * Breakpoint roles:
 * - 2xl (default 1536px): wide laptop / compact desktop — max-width, dense grids.
 * - 3xl (1920px): full-HD layouts, extra horizontal rhythm.
 * - 4xl (2560px): ultra-wide / very large canvases.
 */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        signal: 'var(--secondary)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
          hover: 'var(--card-hover)',
          'hover-foreground': 'var(--card-hover-foreground)',
        },
        /** Box surfaces (matches `@theme` `--color-box`) — raised panels / footer shell */
        box: 'var(--box)',
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        surface: {
          panel: 'var(--surface-panel)',
          works: 'var(--surface-works)',
        },
        'image-well': 'var(--image-well)',
        'control-filled': 'var(--control-filled)',
        'control-filled-foreground': 'var(--control-filled-foreground)',
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
    },
  },
} satisfies Config
