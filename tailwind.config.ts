import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Elden Codex theme — dark bronze + matte gold
        // Calibrated for long reading sessions
        bg: {
          deepest: '#14110d', // header / footer
          base: '#1a1612',    // page background
          raised: '#1f1a14',  // cards
          reading: '#2a241c', // article body area
        },
        ink: {
          primary: '#d4c4a8',   // headings on dark
          body: '#c9b896',      // long-form body text
          muted: '#a89878',     // secondary
          subtle: '#8a7a5c',    // captions, metadata
          faint: '#6b5a38',     // dividers, ornaments
        },
        gold: {
          DEFAULT: '#c9a559',   // matte gold accent
          dim: '#8a6a2f',
          bright: '#d4b572',
        },
        edge: {
          DEFAULT: '#3a3228',   // default borders
          strong: '#6b5a38',    // emphasized borders
          subtle: '#2a241c',    // subtle dividers
        },
        danger: {
          DEFAULT: '#c44a3a',
          bg: '#2a1612',
          border: '#6b3525',
        },
        dlc: {
          DEFAULT: '#8a7ac9',
          bg: '#1f1a2a',
          border: '#3a3a6b',
        },
      },
      fontFamily: {
        gothic: ['Cinzel', 'Trajan Pro', 'serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      letterSpacing: {
        widest: '0.18em',
        gothic: '0.14em',
      },
      maxWidth: {
        prose: '70ch',
      },
    },
  },
  plugins: [],
};

export default config;
