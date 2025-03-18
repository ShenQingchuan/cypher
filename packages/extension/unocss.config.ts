import { defineConfig, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [
        '**/*.{js,ts,jsx,tsx}',
      ],
    },
  },
  presets: [
    presetWind4(),
    presetWebFonts({
      fonts: {
        sans: 'Inter',
        mono: 'JetBrains Mono',
      },
    }),
  ],
  theme: {
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
        950: '#082f49',
      },
    },
  },
  rules: [
    ['split-parent', { display: 'flex', overflow: 'hidden' }],
    ['gutter', {
      background: 'var(--un-bg-color)',
      position: 'relative',
      cursor: 'col-resize',
    }],
    ['gutter-vertical', {
      height: '8px',
      margin: '-4px 0',
      cursor: 'row-resize',
      width: '100%',
      zIndex: '1',
    }],
    ['gutter-horizontal', {
      width: '8px',
      margin: '0 -4px',
      height: '100%',
      zIndex: '1',
    }],
  ],
})
