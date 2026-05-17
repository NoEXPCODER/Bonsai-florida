/*
 * ============================================================
 * BONSAI FLORIDA — DESIGN SYSTEM
 * ============================================================
 *
 * COLORS:
 *   forest          #1a3c28   Deep forest green — brand primary
 *   forest-light    #2d5a3d   Hover / lighter green
 *   forest-dark     #0f2418   Dark green for text on light bg
 *   sage            #7a9b7a   Muted sage — secondary accents
 *   sage-pale       #e8f0e8   Very light sage for subtle bg
 *   cream           #faf7ee   Warm ivory — page background
 *   cream-warm      #f5efe0   Slightly warmer cream for alt sections
 *   cream-light     #fffdf8   Near-white cream for cards
 *   bonsai-pink     #c8658a   Soft floral pink — accent only
 *   bonsai-pink-lt  #e8a5be   Lighter pink for dividers
 *   bonsai-pink-pale #f5d5e2  Pale pink for section tints
 *   ink             #142318   Primary body text (dark green-black)
 *   ink-light       #4a6050   Secondary / muted text
 *
 * TYPOGRAPHY:
 *   font-serif    Playfair Display  — headings, brand name
 *   font-sans     Inter             — body, buttons, captions
 *   Base size: 18px for readability (older customers)
 *
 * BUTTONS:
 *   Primary:    bg-forest text-white rounded-full py-4 px-8 font-bold
 *   Secondary:  border-2 border-forest text-forest rounded-full py-4 px-8
 *   Minimum touch height: 56px (mobile accessibility)
 *
 * CARDS:
 *   bg-cream-light border border-forest/15 rounded-3xl shadow-card
 *
 * SHADOWS:
 *   soft     0 4px 24px rgba(26,60,40,0.07)
 *   card     0 8px 32px rgba(26,60,40,0.10)
 *   card-lg  0 16px 48px rgba(26,60,40,0.13)
 *
 * SPACING:
 *   Section padding: py-20 (80px)
 *   Card padding:    p-6 or p-8
 *   Gap between elements: gap-6 (24px)
 * ============================================================
 */

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1a3c28',
          light: '#2d5a3d',
          dark: '#0f2418',
        },
        sage: {
          DEFAULT: '#7a9b7a',
          light: '#a8c4a8',
          pale: '#e8f0e8',
        },
        cream: {
          DEFAULT: '#faf7ee',
          warm: '#f5efe0',
          light: '#fffdf8',
        },
        'bonsai-pink': '#c8658a',
        'bonsai-pink-lt': '#e8a5be',
        'bonsai-pink-pale': '#f5d5e2',
        ink: {
          DEFAULT: '#142318',
          light: '#4a6050',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(26,60,40,0.07)',
        card: '0 8px 32px rgba(26,60,40,0.10)',
        'card-lg': '0 16px 48px rgba(26,60,40,0.13)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}

export default config
